const natural = require('natural');
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer.stem;

exports.normalizeSkill = (skill) => {
  return stemmer(
    skill.toString()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
  );
};

exports.vectorizeSkills = (skills, allSkills) => {
  return allSkills.map(baseSkill => 
    skills.some(s => exports.normalizeSkill(s) === exports.normalizeSkill(baseSkill) ? 1 : 0
  ));
};