<script>
    export let sendFunction;
    export let generating;
    export let num;

    let stream;
    let audioContext;
    let sourceNode;
    let audioProcessorNode;
    let audioChunks = [];
    let isRecording = false;
    let sampleRate;

    function writeString(view, offset, str) {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    }

    function floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }

    function encodeWAV(samples, sampleRate) {
        const buffer = new ArrayBuffer(44 + samples.length * 2);
        const view = new DataView(buffer);

        // All browser - for some unknown reason - do not support audio/wav which is needed for Azure Speech Service. Reinventing the wheel...

        writeString(view, 0, 'RIFF');
        view.setUint32(4, 36 + samples.length * 2, true);
        writeString(view, 8, 'WAVE');
        writeString(view, 12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(view, 36, 'data');
        view.setUint32(40, samples.length * 2, true);

        floatTo16BitPCM(view, 44, samples);

        return new Blob([view], { type: 'audio/wav' });
    }

    async function sendAudioToBackend() {
        if (audioChunks.length === 0) {
            console.warn('No audio chunks to send.');
            return;
        }

        let totalLength = 0;
        for (let i = 0; i < audioChunks.length; i++) {
            totalLength += audioChunks[i].length;
        }
        const allSamples = new Float32Array(totalLength);
        let offset = 0;
        for (let i = 0; i < audioChunks.length; i++) {
            allSamples.set(audioChunks[i], offset);
            offset += audioChunks[i].length;
        }

        const audioBlob = encodeWAV(allSamples, sampleRate);
        console.log('Generated WAV Blob size:', audioBlob.size, 'type:', audioBlob.type);

        try {
            const response = await fetch('/papi/v1/transcribe', {
                method: 'POST',
                headers: {
                    'Content-Type': audioBlob.type
                },
                body: audioBlob
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Backend response:', result);

                if (response.status === 200) {
                    document.getElementById("prompt").textContent += result.transcription;
                }
            } else {
                const errorText = await response.text();
                console.error('Failed to send audio to backend:', response.status, errorText);
            }
        } catch (error) {
            console.error('Network error during audio stream:', error);
        } finally {
            audioChunks = [];
        }
    }

    const audioWorkletProcessorCode = `
        class AudioDataProcessor extends AudioWorkletProcessor {
            constructor() {
                super();
                this.port.postMessage({ type: 'processor-ready' });
            }

            process(inputs, outputs, parameters) {
                const input = inputs[0];
                if (input.length > 0) {
                    const audioBuffer = input[0]; // Get the Float32Array of audio data
                    this.port.postMessage({ type: 'audio-data', data: new Float32Array(audioBuffer) });
                }
                return true; // Keep the processor alive
            }
        }
        registerProcessor('audio-data-processor', AudioDataProcessor);
    `;

    /**
     * Currently this is sending only once the recording has been stopped.
     * TODO: Solution with Websockets and realtime transcription?
     */
    async function startRecording() {
        try {
            audioChunks = [];
            stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: false,
                    autoGainControl: false,
                    volume: 0.75,
                    sampleRate: 16000,
                    channelCount: 1
                }
            });

            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            sampleRate = audioContext.sampleRate;
            sourceNode = audioContext.createMediaStreamSource(stream);

            const blob = new Blob([audioWorkletProcessorCode], { type: 'application/javascript' });
            const blobUrl = URL.createObjectURL(blob);

            await audioContext.audioWorklet.addModule(blobUrl);
            audioProcessorNode = new AudioWorkletNode(audioContext, 'audio-data-processor');

            URL.revokeObjectURL(blobUrl);
            sourceNode.connect(audioProcessorNode);
            audioProcessorNode.connect(audioContext.destination);

            audioProcessorNode.port.onmessage = (event) => {
                if (event.data.type === 'audio-data') {
                    const rawAudioChunk = event.data.data;
                    audioChunks.push(rawAudioChunk);
                }
            };

            isRecording = true;
        } catch (error) {
            console.error('Error accessing microphone:', error);
            isRecording = false;
        }
    }

    function stopRecording() {
        if (!isRecording) {
            console.warn('Not currently recording.');
            return;
        }

        console.log('Recording stopped. Total chunks:', audioChunks.length);

        if (sourceNode) {
            sourceNode.disconnect();
            sourceNode = null;
        }
        if (audioProcessorNode) {
            audioProcessorNode.disconnect();
            if (audioProcessorNode.onaudioprocess) {
                audioProcessorNode.onaudioprocess = null;
            }
        }
        if (audioContext && audioContext.state !== 'closed') {
            audioContext.close().then(() => {
                console.log('AudioContext closed.');
                audioContext = null;
            });
        }
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            stream = null;
        }

        if (audioChunks.length > 0) {
            sendAudioToBackend();
        }

        isRecording = false;
    }
</script>

<div class="w-full align-middle pb-0.5">
    <div class="bg-white shadow shadow-teal-950 rounded m-2 mt-2">
        <div class="flex w-full flex-col overflow-hidden bg-surface-alt text-on-surface has-[p:focus]:outline-2 has-[p:focus]:rounded has-[p:focus]:outline-offset-2 has-[p:focus]:outline-primary dark:border-outline-dark dark:bg-surface-dark-alt dark:text-on-surface-dark dark:has-[p:focus]:outline-primary-dark">
            <div class="p-1">
                <p id="promptLabel" class="pb-0.5 pl-1 text-sm font-bold text-on-surface opacity-60 dark:text-on-surface-dark">Prompt</p>
                <div class="scroll-on h-24 w-full overflow-y-auto px-1 py-0.5 focus:outline-hidden" role="textbox" aria-labelledby="promptLabel" tabindex="0" id="prompt" contenteditable="{!generating}"></div>
            </div>

            <div class="flex w-full items-center justify-end gap-2 px-1 py-1">
                {#if num <= 0}
                    <button class="text-xs md:text-sm mb-1 bg-transparent hover:bg-teal-800 text-teal-700 font-semibold hover:text-white py-1 px-4 border border-teal-500 hover:border-transparent rounded hover:cursor-pointer" onclick={
                        () => document.getElementById("prompt").textContent = "Hallo"
                    }>
                        Beginne eine Konversation
                    </button>
                {/if}

                <button class="text-xs md:text-sm mb-1 bg-transparent hover:bg-teal-800 text-teal-700 font-semibold hover:text-white py-1 px-4 border border-teal-500 hover:border-transparent rounded hover:cursor-pointer" onclick={
                    () => document.getElementById("prompt").textContent = "Liste alle Benutzeraccounts auf."
                }>
                    Liste alle Accounts
                </button>

                <button class="mb-1 rounded-radius p-1 text-on-surface/75 hover:bg-surface-dark/10 hover:text-on-surface focus:outline-hidden focus-visible:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-primary active:bg-surface-dark/5 active:-outline-offset-2 dark:text-on-surface-dark/75 dark:hover:bg-surface/10 dark:hover:text-on-surface-dark dark:focus-visible:text-on-surface-dark dark:focus-visible:outline-primary-dark dark:active:bg-surface/5 hover:{generating ? 'cursor-wait' : 'cursor-pointer'}" title="Use Voice" aria-label="Use Voice" onclick={() => isRecording ? stopRecording() : startRecording()}>
                    {#if isRecording}
                        <svg viewBox="0 0 20 20" fill="currentColor" class="size-5" aria-hidden="true">
                            <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
                            <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
                            <path d="M3.25 3.25L16.75 16.75" stroke="currentColor" stroke-width="2" />
                        </svg>
                    {:else}
                        <svg viewBox="0 0 20 20" fill="currentColor" class="size-5" aria-hidden="true">
                            <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
                            <path d="M5.5 9.643a.75.75 0 0 0-1.5 0V10c0 3.06 2.29 5.585 5.25 5.954V17.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5v-1.546A6.001 6.001 0 0 0 16 10v-.357a.75.75 0 0 0-1.5 0V10a4.5 4.5 0 0 1-9 0v-.357Z" />
                        </svg>
                    {/if}
                </button>

                <button class="mr-3 mb-1 hover:{generating ? 'cursor-wait' : 'cursor-pointer'}" aria-label="Senden" onclick={sendFunction}>
                    <svg width="24" height="24" fill="#000000" viewBox="0 0 256 256">
                        <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    </div>
</div>
