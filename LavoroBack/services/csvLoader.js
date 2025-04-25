const csv = require('csv-parser');
const fs = require('fs');
const natural = require('natural');
const stemmer = natural.PorterStemmer.stem;

class CSVLoader {
  constructor() {
    this.trainingData = [];
    this.skillSet = new Set();
  }

  load(path) {
    return new Promise((resolve, reject) => {
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (row) => {
          const entry = this.processRow(row);
          this.trainingData.push(entry);
        })
        .on('end', () => {
          console.log(`CSV chargé avec ${this.trainingData.length} entrées`);
          resolve(this.prepareTrainingData());
        })
        .on('error', reject);
    });
  }

  processRow(row) {
    const requiredSkills = this.normalizeSkills(row.task_required_skill);
    const employerSkills = this.normalizeSkills(row.employer_skill);
    
    requiredSkills.forEach(skill => this.skillSet.add(skill));
    employerSkills.forEach(skill => this.skillSet.add(skill));

    return {
      requiredSkills,
      employerSkills,
      match: parseInt(row.match) === 1
    };
  }

  normalizeSkills(skillStr) {
    return skillStr.split(',')
      .map(skill => stemmer(skill.trim().toLowerCase()))
      .filter(skill => skill.length > 0);
  }

  prepareTrainingData() {
    const skillArray = Array.from(this.skillSet);
    return {
      features: this.trainingData.map(data => 
        this.vectorize(data.employerSkills, skillArray)),
      labels: this.trainingData.map(data => data.match ? 1 : 0),
      skillVocab: skillArray
    };
  }

  vectorize(skills, vocabulary) {
    return vocabulary.map(skill => 
      skills.includes(skill) ? 1 : 0
    );
  }
}

module.exports = new CSVLoader();