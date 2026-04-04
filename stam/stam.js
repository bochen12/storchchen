fetch('stamdata.json')
  .then(res => res.json())
  .then(data => create(data))
  .catch(err => console.error(err))

function create(data) {
  const f3Chart = f3.createChart('#FamilyChart', data)
    .setTransitionTime(1000)
    .setCardXSpacing(250)
    .setCardYSpacing(150)

  f3Chart.setCardHtml()
  .setCardDisplay([["first name","last name"],["birthday"]])

  f3Chart.updateTree({initial: true})
}