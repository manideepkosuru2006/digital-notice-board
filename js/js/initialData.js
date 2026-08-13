// Pre-populated realistic college notices and personas

export const INITIAL_USERS = [
  {
    id: "user-1",
    name: "Dr. V. K. Raman",
    role: "Controller of Examinations",
    department: "Examination Cell",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "user-2",
    name: "Prof. Ananya Sharma",
    role: "HOD - Computer Science",
    department: "Computer Science",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "user-3",
    name: "Mr. Rajesh Verma",
    role: "Training & Placement Officer",
    department: "Placement Cell",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: "user-4",
    name: "Dr. S. K. Mukherjee",
    role: "Dean of Academic Affairs",
    department: "Academic Office",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
  }
];

export const INITIAL_NOTICES = [
  {
    id: "NTC-2026-001",
    title: "End-Semester Examination Timetable - Autumn 2026",
    content: `All students of B.Tech / M.Tech programs are hereby notified that the End-Semester Examinations for Autumn 2026 will commence from September 1, 2026. 

Key Instructions:
1. Hall tickets will be issued at the Examination Cell starting August 25, 2026.
2. Students must clear all library dues and tuition fees prior to hall ticket collection.
3. Strict adherence to exam timing is mandatory. Mobile phones and smart devices are strictly prohibited inside examination halls.

Detailed subject-wise slot timings are attached in the official document below.`,
    category: "Examinations",
    department: "All Departments",
    targetYear: "All Years",
    priority: "Urgent",
    status: "Published",
    isPinned: true,
    publishedAt: "2026-08-13T09:30:00Z",
    expiresAt: "2026-09-15T23:59:59Z",
    author: "Dr. V. K. Raman",
    authorRole: "Controller of Examinations",
    refNumber: "REF: EXAM/2026/08/442",
    views: 842,
    attachments: [
      { name: "End_Sem_Timetable_Autumn_2026.pdf", size: "1.8 MB", type: "pdf" }
    ],
    venue: "Main Examination Blocks A & B"
  },
  {
    id: "NTC-2026-002",
    title: "Campus Placement Drive: Google Cloud & Microsoft India",
    content: `The Training & Placement Cell is pleased to announce a joint campus recruitment drive for final year B.Tech (CS / ECE) students.

Position: Software Development Engineer (SDE-1) & Cloud Associate
Package: ₹18.5 LPA - ₹24.0 LPA
Eligibility Criteria: Minimum 7.5 CGPA with no active backlogs.

Registration Deadline: August 18, 2026 (5:00 PM IST)
Pre-placement Talk Schedule: August 20, 2026 at 10:00 AM in the Main Auditorium. Eligible candidates must carry 3 copies of updated resume and college ID.`,
    category: "Placements",
    department: "Computer Science",
    targetYear: "4th Year",
    priority: "High",
    status: "Published",
    isPinned: true,
    publishedAt: "2026-08-12T14:15:00Z",
    expiresAt: "2026-08-19T17:00:00Z",
    author: "Mr. Rajesh Verma",
    authorRole: "Training & Placement Officer",
    refNumber: "REF: TPC/RECRUIT/2026/91",
    views: 1250,
    attachments: [
      { name: "Eligibility_Criteria_JD.pdf", size: "890 KB", type: "pdf" },
      { name: "Placement_Registration_Form.docx", size: "245 KB", type: "doc" }
    ],
    venue: "Main Auditorium & Placement Lab"
  },
  {
    id: "NTC-2026-003",
    title: "National Hackathon 'TechMatrix 2026' Registration Open",
    content: `The Department of Computer Science & Engineering invites student teams to participate in 'TechMatrix 2026', a 36-hour national inter-college hackathon.

Themes:
- AI & Intelligent Systems
- Smart Campus Innovations
- Green Tech & Sustainability
- Cybersecurity & Privacy

Prize Pool: ₹1,50,000 cash prizes + Cloud Credits + Internship Opportunities!
Free food, refreshments, and hackathon swags provided to all shortlisted teams. Submit your project abstracts before August 22, 2026.`,
    category: "Events",
    department: "Computer Science",
    targetYear: "All Years",
    priority: "High",
    status: "Published",
    isPinned: false,
    publishedAt: "2026-08-11T11:00:00Z",
    expiresAt: "2026-08-23T23:59:59Z",
    author: "Prof. Ananya Sharma",
    authorRole: "HOD - Computer Science",
    refNumber: "REF: CSE/HACK/2026/108",
    views: 630,
    attachments: [
      { name: "TechMatrix_Hackathon_Brochure.pdf", size: "3.4 MB", type: "pdf" }
    ],
    venue: "CS Block Innovation Lab & Seminar Hall 2"
  },
  {
    id: "NTC-2026-004",
    title: "Urgent: Clearance of Library Books before Monsoon Recess",
    content: `All undergraduate and postgraduate students are requested to return borrowed central library books or renew their issue dates by August 20, 2026.

Late fees of ₹10 per day per book will automatically apply after the due date. The online library portal is open 24/7 for digital renewals.`,
    category: "Academic",
    department: "All Departments",
    targetYear: "All Years",
    priority: "Normal",
    status: "Published",
    isPinned: false,
    publishedAt: "2026-08-10T16:20:00Z",
    expiresAt: "2026-08-21T18:00:00Z",
    author: "Dr. S. K. Mukherjee",
    authorRole: "Dean of Academic Affairs",
    refNumber: "REF: LIB/NOTICE/2026/304",
    views: 410,
    attachments: [],
    venue: "Central Library Counter"
  },
  {
    id: "NTC-2026-005",
    title: "Inter-Department Football Tournament 2026 Fixtures",
    content: `The Sports Council announces the annual Inter-Department Football Championship starting from August 25, 2026.

Opening Match: Computer Science vs Mechanical Engineering
Date: August 25, 2026 | Time: 4:00 PM IST
Venue: Main Athletic Ground

All department team captains are instructed to submit their final 16-member team rosters signed by respective HODs by August 18, 2026.`,
    category: "Sports",
    department: "All Departments",
    targetYear: "All Years",
    priority: "Normal",
    status: "Published",
    isPinned: false,
    publishedAt: "2026-08-09T10:00:00Z",
    expiresAt: "2026-08-30T19:00:00Z",
    author: "Dr. S. K. Mukherjee",
    authorRole: "Dean of Academic Affairs",
    refNumber: "REF: SPORTS/2026/012",
    views: 388,
    attachments: [
      { name: "Football_Tournament_Fixtures.pdf", size: "520 KB", type: "pdf" }
    ],
    venue: "Main College Sports Ground"
  },
  {
    id: "NTC-2026-006",
    title: "Faculty Advisory Committee Meeting - Draft Minutes",
    content: `Internal meeting draft regarding curriculum revision for Autonomous Academic Session 2026-27. Pending final Senate ratification.`,
    category: "Academic",
    department: "Computer Science",
    targetYear: "All Years",
    priority: "Normal",
    status: "Draft",
    isPinned: false,
    publishedAt: "2026-08-13T08:00:00Z",
    expiresAt: "2026-09-30T23:59:59Z",
    author: "Prof. Ananya Sharma",
    authorRole: "HOD - Computer Science",
    refNumber: "REF: CSE/DRAFT/2026/004",
    views: 12,
    attachments: [],
    venue: "CS Department Conference Room"
  }
];

export const DEPARTMENTS = [
  "All Departments",
  "Computer Science",
  "Electronics & Comm (ECE)",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Biotechnology"
];

export const ACADEMIC_YEARS = [
  "All Years",
  "1st Year",
  "2nd Year",
  "3rd Year",
  "4th Year"
];

export const CATEGORIES = [
  "All Categories",
  "Academic",
  "Examinations",
  "Placements",
  "Events",
  "Sports",
  "General"
];

export const PRIORITIES = [
  "All Priorities",
  "Urgent",
  "High",
  "Normal"
];
