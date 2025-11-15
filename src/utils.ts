import fs from "fs";
import path from "path";

export default {
    getTokens(): string[] | null {
        const tokensPath = path.join(__dirname, "..", "tokens.txt");

        if (!fs.existsSync(tokensPath)) return null;

        const tokens = fs
            .readFileSync(tokensPath, "utf8")
            .split("\n")
            .map(t => t.trim())
            .filter(Boolean);

        return tokens.length ? tokens : null;
    }
}
