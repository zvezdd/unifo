import type { University } from '../types/university'

export const dummyUniversities: University[] = [
  {
    id: 'nu',
    name: 'Nazarbayev University',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/8/8f/Nazarbayev_University_logo.png',
    location: 'Astana, Kazakhstan',
    missionHistory:
      'To be a leading center of education, research, and innovation in Kazakhstan.\n\nFounded in 2010 as a modern research university with international partnerships.',
    achievements: [
      'Top research output in Central Asia',
      'Multiple QS-ranked programs',
      'State-of-the-art laboratories',
    ],
    admissions: {
      requirements: [
        'Completed secondary education',
        'English proficiency (IELTS/TOEFL)',
        'Subject-specific exams or SAT/ACT',
      ],
      deadlines: ['Fall intake: July 1', 'Spring intake: December 15'],
      scholarships: [
        'NU Merit Scholarship',
        'State Grant for high achievers',
        'Research assistantships for graduate students',
      ],
    },
    cooperation: {
      partners: ['Duke University', 'University of Wisconsin-Madison'],
      exchangePrograms: ['Semester abroad', 'Joint research fellowships'],
      foreignStudentInfo:
        'International applicants receive visa support and dedicated onboarding.',
    },
    tour3dUrl: 'https://my.matterport.com/show/?m=DMQnVvzHPG5',
    programs: [
      {
        id: 'cs-bsc',
        title: 'Computer Science BSc',
        duration: '4 years',
        tuitionFee: '$8,000 per year',
        description:
          'Focus on software engineering, data science, and scalable systems.',
      },
      {
        id: 'eee-bsc',
        title: 'Electrical & Electronic Engineering BSc',
        duration: '4 years',
        tuitionFee: '$8,000 per year',
        description:
          'Covers power systems, electronics, telecommunications, and control.',
      },
    ],
  },
  {
    id: 'kbtuw',
    name: 'Kazakh-British Technical University',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/9/95/KBTU_logo.png',
    location: 'Almaty, Kazakhstan',
    missionHistory:
      'Deliver world-class technical education aligned with industry needs.\n\nEstablished in 2001 with support from the British Council.',
    achievements: [
      'Leading oil & gas engineering programs',
      'Strong industry partnerships with energy sector',
    ],
    admissions: {
      requirements: [
        'Unified National Testing (UNT) or equivalent',
        'English proficiency for international tracks',
      ],
      deadlines: ['Fall intake: June 30'],
      scholarships: ['KBTU Excellence Grant', 'Industry-sponsored grants'],
    },
    cooperation: {
      partners: ['University of London', 'Heriot-Watt University'],
      exchangePrograms: ['Dual degree options', 'Internships abroad'],
      foreignStudentInfo:
        'Dedicated support center for international mobility and visas.',
    },
    tour3dUrl: 'https://my.matterport.com/show/?m=7b2z7ogPz9K',
    programs: [
      {
        id: 'petro-bsc',
        title: 'Petroleum Engineering BSc',
        duration: '4 years',
        tuitionFee: '$6,000 per year',
        description:
          'Reservoir engineering, drilling operations, and production management.',
      },
      {
        id: 'fin-bsc',
        title: 'Finance BSc',
        duration: '4 years',
        tuitionFee: '$5,500 per year',
        description: 'Corporate finance, fintech, and investment analysis.',
      },
    ],
  },
  {
    id: 'aitu',
    name: 'Astana IT University',
    logoUrl:
      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Astana_IT_University_logo.svg',
    location: 'Astana, Kazakhstan',
    missionHistory:
      'Prepare digital leaders and innovators for Kazakhstan and the region.\n\nFounded in 2019 with a focus on IT and digital transformation.',
    achievements: [
      'National leader in ICT education',
      'Strong startup and innovation ecosystem',
    ],
    admissions: {
      requirements: ['UNT or foundation program', 'English placement test'],
      deadlines: ['Fall intake: July 15'],
      scholarships: ['Digital Talent Scholarship', 'State educational grants'],
    },
    cooperation: {
      partners: ['Cisco', 'Huawei', 'EPAM'],
      exchangePrograms: ['Tech internships', 'Erasmus+ mobility'],
      foreignStudentInfo:
        'International office provides housing and visa support.',
    },
    tour3dUrl: 'https://my.matterport.com/show/?m=8qkF7n4b4j7',
    programs: [
      {
        id: 'se-bsc',
        title: 'Software Engineering BSc',
        duration: '4 years',
        tuitionFee: '$4,500 per year',
        description: 'Full-stack development, cloud-native systems, DevOps.',
      },
      {
        id: 'cyber-bsc',
        title: 'Cybersecurity BSc',
        duration: '4 years',
        tuitionFee: '$4,800 per year',
        description: 'Network security, cryptography, and security operations.',
      },
    ],
  },
]

