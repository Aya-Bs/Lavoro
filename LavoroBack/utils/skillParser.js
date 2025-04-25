const natural = require('natural');
const stemmer = natural.PorterStemmer.stem;

exports.parseSkills = (skillString) => {
  if (!skillString) return [];
  
  return skillString.split(',')
    .map(skill => stemmer(skill.trim().toLowerCase()))
    .filter(skill => skill.length > 0);
};

exports.normalizeSkill = (skill) => {
  return stemmer(
    skill.toString()
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim()
  );
};