import type { Course } from "@/types/course"

export const courses: Course[] = [
  {
    id: "1",
    title: "Introduction to Project Management",
    shortDescription: "Learn the fundamentals of project management and team leadership.",
    description:
      "This comprehensive course covers the basics of project management, including planning, execution, monitoring, and closing projects. You will learn about various methodologies such as Agile, Scrum, and Waterfall, and understand when to apply each approach. The course also covers team leadership, stakeholder management, and effective communication strategies.",
    duration: "4 weeks",
    instructor: "Sarah Johnson",
    prerequisites: "None",
  },
  {
    id: "2",
    title: "Advanced Data Analysis with Excel",
    shortDescription: "Master advanced Excel functions and data analysis techniques.",
    description:
      "Take your Excel skills to the next level with this advanced course. Learn how to use pivot tables, VLOOKUP, HLOOKUP, and other advanced functions to analyze complex datasets. The course also covers data visualization techniques, dashboard creation, and how to automate repetitive tasks using macros and VBA.",
    duration: "3 weeks",
    instructor: "Michael Chen",
    prerequisites: "Basic Excel knowledge",
  },
  {
    id: "3",
    title: "Effective Communication Skills",
    shortDescription: "Develop essential communication skills for the workplace.",
    description:
      "This course focuses on developing effective verbal and written communication skills for professional settings. Topics include active listening, giving and receiving feedback, presentation skills, email etiquette, and conflict resolution. Through practical exercises and role-playing, you will gain confidence in your ability to communicate clearly and persuasively.",
    duration: "2 weeks",
    instructor: "Emily Rodriguez",
    prerequisites: "None",
  },
  {
    id: "4",
    title: "Cybersecurity Fundamentals",
    shortDescription: "Learn the basics of cybersecurity and how to protect sensitive data.",
    description:
      "This introductory course covers the essential concepts of cybersecurity, including threat identification, risk assessment, and security best practices. You will learn about common attack vectors, how to create strong passwords, the importance of multi-factor authentication, and basic encryption concepts. The course also covers compliance requirements and how to respond to security incidents.",
    duration: "5 weeks",
    instructor: "David Kim",
    prerequisites: "Basic computer knowledge",
  },
  {
    id: "5",
    title: "Leadership and Team Building",
    shortDescription: "Develop leadership skills and learn how to build high-performing teams.",
    description:
      "This course is designed for new and aspiring leaders who want to develop their leadership skills and learn how to build and manage effective teams. Topics include leadership styles, motivation techniques, delegation, performance management, and team dynamics. Through case studies and interactive exercises, you will develop practical skills that you can apply immediately in your workplace.",
    duration: "6 weeks",
    instructor: "James Wilson",
    prerequisites: "At least 1 year of professional experience",
  },
  {
    id: "6",
    title: "Introduction to Python Programming",
    shortDescription: "Learn the basics of Python programming for data analysis and automation.",
    description:
      "This beginner-friendly course introduces you to Python programming with a focus on practical applications for business. You will learn basic syntax, data structures, control flow, and how to work with libraries such as Pandas and NumPy for data analysis. The course also covers automation of repetitive tasks and basic web scraping techniques. No prior programming experience is required.",
    duration: "8 weeks",
    instructor: "Lisa Zhang",
    prerequisites: "None",
  },
]
