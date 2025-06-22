import * as sdk from 'microsoft-cognitiveservices-speech-sdk';
import { Unlock } from "$lib/api/unlock/unlock.js";
import { json, text } from "@sveltejs/kit";
// DEBUG: import fs from "node:fs";
import dotenv from "dotenv";
dotenv.config();

const subscriptionKey = process.env.AZURE_SPEECH_KEY;
const serviceRegion = process.env.AZURE_SPEECH_REGION;

export async function POST({ request, cookies }) {
    const accessToken = cookies.get("access_token");
    if(!accessToken || !(await Unlock.isAccessTokenStillValid(accessToken))) {
        return text("No Permission.", { status: 403 });
    }

    let recognizer = null;

    try {
        const audioBlob = await request.blob();
        console.log(`[Backend] Received audio blob: type=${audioBlob.type}, size=${audioBlob.size} bytes`);

        if (audioBlob.size === 0) {
            console.warn('[Backend] No audio data provided in the request.');
            return new Response(JSON.stringify({
                error: 'No audio data provided.',
                transcription: ''
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const pushStream = sdk.AudioInputStream.createPushStream(sdk.AudioStreamFormat.getWaveFormatPCM(48000, 16, 1));
        const arrayBuffer = await audioBlob.arrayBuffer();
        // DEBUG: fs.writeFileSync("./src/test.wav", new Buffer(new Uint8Array(arrayBuffer)));
        pushStream.write(arrayBuffer);
        pushStream.close();

        const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
        const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
        speechConfig.speechRecognitionLanguage = "de-DE";

        recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
        console.log("[Backend] Starting speech recognition with Azure Speech Service...");

        recognizer.canceled = (s, e) => {
            console.log(`[Backend] CANCELED Event: Reason=${e.reason}`);
            if (e.reason === sdk.CancellationReason.Error) {
                console.error(`[Backend] CANCELED due to Error: Code=${e.errorCode}, Details=${e.errorDetails}`);
            }
        };

        const result = await new Promise((resolve, reject) => {
            recognizer.recognizeOnceAsync(
                (speechRecognitionResult) => {
                    resolve(speechRecognitionResult);
                },
                (error) => {
                    reject(new Error(`Azure Speech SDK Error: ${error}`));
                }
            );
        });

        let transcription;
        let responseMessage = "Transcription successful.";
        let httpStatus;

        switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
                transcription = result.text;
                httpStatus = 200;
                break;
            case sdk.ResultReason.NoMatch:
                transcription = "Could not recognize speech. No speech could be matched to the audio input.";
                responseMessage = "No speech detected or recognized.";
                httpStatus = 201;
                break;
            case sdk.ResultReason.Canceled:
                transcription = `Recognition canceled. ErrorDetails=${result.errorDetails}`;
                responseMessage = transcription;
                httpStatus = 500;
                break;
            default:
                transcription = `Unexpected recognition result reason: ${result.reason}`;
                responseMessage = transcription;
                httpStatus = 500;
                break;
        }

        return json({
            transcription: transcription,
            message: responseMessage
        }, {
            status: httpStatus
        });
    } catch (error) {
        console.error('[Backend] Caught an error during speech recognition processing:', error);
        return new Response(JSON.stringify({
            error: 'Failed to process audio for transcription.',
            details: error.message,
            transcription: ''
        }), {
            status: 500, // Internal Server Error
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } finally {
        if (recognizer) {
            recognizer.close();
            console.log("[Backend] Speech recognizer closed.");
        }
    }
}
