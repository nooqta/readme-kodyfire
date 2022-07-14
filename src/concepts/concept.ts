import { IConcept, ITechnology } from 'kodyfire-core';
import { join, relative } from 'path';

import { Concept as BaseConcept } from 'basic-kodyfire';
import { Engine } from './engine';

// readme-md-generator related utilities
// Step 3 and 4 of the README-MD-GENERATOR workflow
const useDefaultAnswers = false;
const infos = require('readme-md-generator/src/project-infos');
const cleanContext = require('readme-md-generator/src/clean-context');
const askQuestions = require('readme-md-generator/src/ask-questions');

export class Concept extends BaseConcept {
  constructor(concept: Partial<IConcept>, technology: ITechnology) {
    super(concept, technology);
    this.engine = new Engine();
  }

  async generate(_data: any) {
    this.engine = new Engine();

    const template = await this.engine.read(
      join(this.getTemplatesPath(), this.template.path),
      _data.template
    );
    
    // Step 3 of the README-MD-GENERATOR workflow: Gathering infos from package.json
    const projectInformations = await infos.getProjectInfos();
    
    // Step 4 of the README-MD-GENERATOR workflow: Ask questions
    const answersContext = await askQuestions(projectInformations, useDefaultAnswers);
    
    // Step 5 of the README-MD-GENERATOR workflow: Clean answers context
    const cleanedContext = cleanContext(answersContext);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const compiled = this.engine.compile(template, {
      currentYear,
      ..._data,
      ...cleanedContext,
    });

    await this.engine.createOrOverwrite(
      this.technology.rootDir,
      this.outputDir,
      this.getFilename(_data),
      compiled
    );
  }

  getFilename(data: any) {
    if (data.filename) return data.filename;
    return join(
      data.outputDir,
      `${data.name}.${this.getExtension(data.template)}`
    );
  }

  getExtension(templateName: string) {
    return templateName.replace('.template', '').split('.').pop();
  }

  getTemplatesPath(): string {
    return this.technology.params.templatesPath
      ? this.technology.params.templatesPath
      : relative(process.cwd(), __dirname);
  }
}
