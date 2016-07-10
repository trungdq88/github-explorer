import GitHubColors from 'github-colors';

const DEFAULT_BACKGROUND_COLOR = '#CCC';

function backgroundColor(languageName) {
  const languageData = GitHubColors.get(languageName);
  return 'color' in languageData ? languageData.color : DEFAULT_BACKGROUND_COLOR;
}

export default backgroundColor;
