export class JsonExtractor {

    static extract(content) {
        const regex = /{.*}/gm;
        const matches = [];

        let m;
        while ((m = regex.exec(content)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                try {
                    matches.push(JSON.parse(match));
                } catch (e) { }
            });
        }

        return matches;
    }
}
