fetch('stamdata.json')
  .then(res => res.json())
  .then(data => create(data))
  .catch(err => console.error(err))

function create(data) {
  const f3Chart = f3.createChart('#FamilyChart', data)
    .setTransitionTime(1000)
    .setCardXSpacing(250)
    .setCardYSpacing(150)
    .setSingleParentEmptyCard(false, {label: ''})
    .setShowSiblingsOfMain(true)
    .setOrientationVertical()
    .setSortChildrenFunction((a, b) => a.data['birthday'] === b.data['birthday'] ? 0 : a.data['birthday'] > b.data['birthday'] ? 1 : -1)

  f3Chart.setCardHtml()
  .setCardDisplay([["first name","last name"],["birthday"]])

  f3Chart.updateTree({initial: true})
}