export const demoUser = {
  name: "Mohammed Al-Ghamdi",
  nameAr: "محمد الغامدي",
  email: "mohammed@example.com",
  title: "Software Engineer",
  plan: "Professional",
  avatar: "https://ui-avatars.com/api/?name=MG&background=006C35&color=fff&size=80",
  careerScore: 87,
  atsScore: 82,
  englishLevel: "B",
  applications: 12,
  replies: 4,
  profileStrength: 88,
  cvStatus: "Optimized",
  portfolioStatus: "Published",
  joinDate: "March 2025",
};

export const demoApplications = [
  { id: 1, company: "Saudi Aramco", position: "Software Engineer", date: "2025-05-10", status: "Interview", logo: "https://ui-avatars.com/api/?name=SA&background=006C35&color=fff&size=40" },
  { id: 2, company: "SABIC", position: "Full Stack Developer", date: "2025-05-08", status: "Pending", logo: "https://ui-avatars.com/api/?name=SB&background=1A56DB&color=fff&size=40" },
  { id: 3, company: "STC", position: "Senior React Developer", date: "2025-05-05", status: "Replied", logo: "https://ui-avatars.com/api/?name=ST&background=6D28D9&color=fff&size=40" },
  { id: 4, company: "Noon", position: "Backend Engineer", date: "2025-05-01", status: "Rejected", logo: "https://ui-avatars.com/api/?name=NO&background=FCD34D&color=333&size=40" },
  { id: 5, company: "PIF", position: "Software Architect", date: "2025-04-28", status: "Pending", logo: "https://ui-avatars.com/api/?name=PF&background=059669&color=fff&size=40" },
  { id: 6, company: "NEOM", position: "Tech Lead", date: "2025-04-25", status: "Replied", logo: "https://ui-avatars.com/api/?name=NM&background=0EA5E9&color=fff&size=40" },
  { id: 7, company: "Al Rajhi Bank", position: "Software Developer", date: "2025-04-20", status: "Pending", logo: "https://ui-avatars.com/api/?name=AR&background=C8A951&color=fff&size=40" },
];

export const demoMessages = [
  {
    id: 1,
    from: "HR Team - Saudi Aramco",
    fromLogo: "https://ui-avatars.com/api/?name=SA&background=006C35&color=fff&size=40",
    subject: "Interview Invitation - Software Engineer Position",
    type: "interview",
    date: "May 12, 2025",
    preview: "Dear Mohammed, We were impressed by your profile and would like to invite you for a technical interview...",
    read: false,
    content: `Dear Mohammed,

We were impressed by your profile on CareerSaudi AI and would like to invite you for a technical interview for the Software Engineer position at Saudi Aramco.

Interview Details:
📅 Date: Monday, May 20, 2025
🕙 Time: 10:00 AM - 11:30 AM
📍 Location: Aramco Campus, Dhahran / Virtual option available
👤 Interviewer: Ahmed Al-Rashidi, Engineering Lead

Please confirm your attendance by replying to this message or calling us at +966-XX-XXX-XXXX.

We look forward to meeting you!

Best regards,
HR Team
Saudi Aramco`,
  },
  {
    id: 2,
    from: "Recruitment - STC",
    fromLogo: "https://ui-avatars.com/api/?name=ST&background=6D28D9&color=fff&size=40",
    subject: "Your application has moved forward!",
    type: "progress",
    date: "May 10, 2025",
    preview: "Great news! Your application for the Senior React Developer position has been shortlisted...",
    read: false,
    content: `Hi Mohammed,

Great news! Your application for the Senior React Developer position has been shortlisted and we would like to proceed to the next stage.

We will be in touch within the next 3 business days to schedule a call with our technical team.

Thank you for your patience!

Recruitment Team
STC`,
  },
  {
    id: 3,
    from: "Talent Acquisition - Noon",
    fromLogo: "https://ui-avatars.com/api/?name=NO&background=FCD34D&color=333&size=40",
    subject: "Update on your application",
    type: "rejection",
    date: "May 5, 2025",
    preview: "Thank you for your interest in the Backend Engineer position at Noon. After careful review...",
    read: true,
    content: `Dear Mohammed,

Thank you for your interest in the Backend Engineer position at Noon and for the time you invested in applying.

After careful review of all applications, we have decided to move forward with other candidates whose experience more closely matches our current needs.

We encourage you to continue exploring opportunities with Noon in the future and wish you the best in your job search.

Warm regards,
Talent Acquisition Team
Noon`,
  },
  {
    id: 4,
    from: "HR - NEOM",
    fromLogo: "https://ui-avatars.com/api/?name=NM&background=0EA5E9&color=fff&size=40",
    subject: "Additional Information Required",
    type: "info",
    date: "April 28, 2025",
    preview: "Dear Mohammed, we have reviewed your application and would like to learn more about...",
    read: true,
    content: `Dear Mohammed,

We have reviewed your application and would like to learn more about your experience with large-scale distributed systems.

Could you please share:
1. A portfolio or GitHub profile with relevant projects
2. A brief description of the most complex system you have built
3. Your availability for a 30-min intro call

Looking forward to hearing from you!

HR Team
NEOM`,
  },
];

export const recommendedJobs = [
  { id: 1, title: "Senior Software Engineer", company: "Saudi Aramco", match: 94, city: "Dhahran" },
  { id: 2, title: "Full Stack Developer", company: "Noon", match: 89, city: "Riyadh" },
  { id: 3, title: "Tech Lead", company: "NEOM", match: 85, city: "Tabuk" },
  { id: 4, title: "React Developer", company: "STC", match: 82, city: "Riyadh" },
];

export const careerProgressData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 68 },
  { month: "Mar", score: 72 },
  { month: "Apr", score: 78 },
  { month: "May", score: 87 },
];

export const hrDemoUser = {
  name: "Laila Al-Rashidi",
  nameAr: "ليلى الراشدي",
  email: "laila.hr@arabian-tech.com",
  title: "Talent Acquisition Manager",
  company: "Arabian Tech Solutions",
  plan: "HR Plan",
  avatar: "https://ui-avatars.com/api/?name=LR&background=1A56DB&color=fff&size=80",
  activeJobs: 8,
  totalApplications: 247,
  shortlisted: 34,
  hired: 12,
};

export const hrJobPosts = [
  { id: 1, title: "Senior Software Engineer", applications: 45, shortlisted: 8, status: "Active", posted: "May 10, 2025", deadline: "Jun 10, 2025" },
  { id: 2, title: "Data Analyst", applications: 32, shortlisted: 5, status: "Active", posted: "May 8, 2025", deadline: "Jun 8, 2025" },
  { id: 3, title: "Product Manager", applications: 67, shortlisted: 12, status: "Active", posted: "May 5, 2025", deadline: "Jun 5, 2025" },
  { id: 4, title: "UX Designer", applications: 28, shortlisted: 4, status: "Closed", posted: "Apr 20, 2025", deadline: "May 20, 2025" },
  { id: 5, title: "DevOps Engineer", applications: 19, shortlisted: 3, status: "Active", posted: "May 12, 2025", deadline: "Jun 12, 2025" },
];

export const hrAnalyticsData = [
  { month: "Jan", applications: 45, hires: 2 },
  { month: "Feb", applications: 62, hires: 3 },
  { month: "Mar", applications: 78, hires: 4 },
  { month: "Apr", applications: 95, hires: 2 },
  { month: "May", applications: 120, hires: 5 },
];
