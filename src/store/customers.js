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
        name: 'Hello',
        address: 'World',
        phoneNumber: '911',
        email: 'a@b.c',
        pic: 'Bob'
      }
    ]
  })
}
