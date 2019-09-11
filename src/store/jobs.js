export default {
  namespaced: true,
  state: () => ({
    jobHeaders: [
      { text: 'Date Issued', value: 'dateIssued' },
      { text: 'State', value: 'state' }
    ],
    jobs: [
      {
        id: 1,
        dateIssued: new Date(),
        state: 'DONE'
      }
    ]
  })
}
