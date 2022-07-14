"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concept = void 0;
const path_1 = require("path");
const basic_kodyfire_1 = require("basic-kodyfire");
const engine_1 = require("./engine");
// readme-md-generator related utilities
// Step 3 and 4 of the README-MD-GENERATOR workflow
const useDefaultAnswers = false;
const infos = require('readme-md-generator/src/project-infos');
const cleanContext = require('readme-md-generator/src/clean-context');
const askQuestions = require('readme-md-generator/src/ask-questions');
class Concept extends basic_kodyfire_1.Concept {
    constructor(concept, technology) {
        super(concept, technology);
        this.engine = new engine_1.Engine();
    }
    generate(_data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.engine = new engine_1.Engine();
            const template = yield this.engine.read((0, path_1.join)(this.getTemplatesPath(), this.template.path), _data.template);
            // Step 3 of the README-MD-GENERATOR workflow: Gathering infos from package.json
            const projectInformations = yield infos.getProjectInfos();
            // Step 4 of the README-MD-GENERATOR workflow: Ask questions
            const answersContext = yield askQuestions(projectInformations, useDefaultAnswers);
            // Step 5 of the README-MD-GENERATOR workflow: Clean answers context
            const cleanedContext = cleanContext(answersContext);
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear();
            const compiled = this.engine.compile(template, Object.assign(Object.assign({ currentYear }, _data), cleanedContext));
            yield this.engine.createOrOverwrite(this.technology.rootDir, this.outputDir, this.getFilename(_data), compiled);
        });
    }
    getFilename(data) {
        if (data.filename)
            return data.filename;
        return (0, path_1.join)(data.outputDir, `${data.name}.${this.getExtension(data.template)}`);
    }
    getExtension(templateName) {
        return templateName.replace('.template', '').split('.').pop();
    }
    getTemplatesPath() {
        return this.technology.params.templatesPath
            ? this.technology.params.templatesPath
            : (0, path_1.relative)(process.cwd(), __dirname);
    }
}
exports.Concept = Concept;
//# sourceMappingURL=concept.js.map