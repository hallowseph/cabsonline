// mockData.js
// Shared dummy booking data for all components.
// When we connect to the real backend later, this gets replaced
// by a fetch() call to getbookings.php — the shape of each object
// stays exactly the same so nothing else needs to change.

const mockBookings = [
  {
    reference: 'BRN00001',
    name: 'Alice Johnson',
    phone: '021 111 2222',
    unumber: '',
    snumber: '12',
    stname: 'Queen Street',
    suburb: 'Auckland CBD',
    dest_suburb: 'Newmarket',
    date: '16/05/2026',
    time: '10:00:00',
    status: 'unassigned',
  },
  {
    reference: 'BRN00002',
    name: 'Bob Smith',
    phone: '021 333 4444',
    unumber: '4B',
    snumber: '88',
    stname: 'Ponsonby Road',
    suburb: 'Ponsonby',
    dest_suburb: 'Auckland Airport',
    date: '16/05/2026',
    time: '11:30:00',
    status: 'assigned',
  },
  {
    reference: 'BRN00003',
    name: 'Carol White',
    phone: '021 555 6666',
    unumber: '',
    snumber: '5',
    stname: 'Dominion Road',
    suburb: 'Mount Eden',
    dest_suburb: 'Britomart',
    date: '16/05/2026',
    time: '14:00:00',
    status: 'unassigned',
  },
  {
    reference: 'BRN00004',
    name: 'David Lee',
    phone: '021 777 8888',
    unumber: '',
    snumber: '200',
    stname: 'Great North Road',
    suburb: 'Grey Lynn',
    dest_suburb: 'Takapuna',
    date: '16/05/2026',
    time: '15:45:00',
    status: 'paid',
  },
  {
    reference: 'BRN00005',
    name: 'Emma Davis',
    phone: '021 999 0000',
    unumber: '2A',
    snumber: '31',
    stname: 'Remuera Road',
    suburb: 'Remuera',
    dest_suburb: 'Sylvia Park',
    date: '17/05/2026',
    time: '09:15:00',
    status: 'unassigned',
  },
];

export default mockBookings;
