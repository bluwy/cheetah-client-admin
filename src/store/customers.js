export default {
  namespaced: true,
  state: () => ({
    customerHeaders: [
      { text: 'Code', value: 'code' },
      { text: 'Name', value: 'name' },
      { text: 'Address', value: 'address' },
      { text: 'Phone', value: 'phoneNumber' },
      { text: 'Email', value: 'email' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    customers: [
      {
        id: 1,
        code: 'AA',
        name: 'ABC Inc.',
        address: 'Earth',
        phoneNumber: '911',
        email: 'a@b.c',
        pic: 'Bob'
      },
      {
        id: 2,
        code: 'BB',
        name: 'Demo Gmbh',
        address: 'Mars',
        phoneNumber: '810',
        email: 'd@m.o',
        pic: 'Stone'
      }
    ]
  }),
  actions: {
    queryCustomers ({ state }, { customerName }) {
      // Todo: Query
      return state.customers.map(v => ({ text: v.name, value: v.id }))
    }
  }
}
