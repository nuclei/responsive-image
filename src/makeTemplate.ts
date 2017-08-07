export const makeTemplate = function (strings: TemplateStringsArray) {
  let html = strings[strings.length - 1]
  let template = document.createElement('template')
  template.innerHTML = html
  return template
}
