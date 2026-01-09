generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  PATIENT
  DOCTOR
  ADMIN
}

enum AppointmentStatus {
  PENDING
  CONFIRMED
  CANCELLED
  COMPLETED
  RESCHEDULED
}

enum NotificationType {
  EMAIL
  SMS
  PUSH
}

model User {
  id              String    @id @default(cuid())
  clerkId         String?   @unique  // Clerk user ID
  email           String    @unique
  name            String
  phone           String?
  avatar          String?   // Uploadthing URL
  role            UserRole  @default(PATIENT)
  emailVerified   Boolean   @default(false)
  phoneVerified   Boolean   @default(false)
  dateOfBirth     DateTime?
  address         String?
  emergencyContact String?
  medicalHistory  String?
  allergies       String[]
  bloodType       String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  // Relations
  appointmentsAsPatient Appointment[] @relation("PatientAppointments")
  appointmentsAsDoctor  Appointment[] @relation("DoctorAppointments")
  notifications        Notification[]
  notificationPreferences NotificationPreference?
  medicalRecords      MedicalRecord[]
  prescriptions       Prescription[]
}

model Doctor {
  id          String   @id @default(cuid())
  userId      String   @unique
  clerkId     String?  @unique  // Clerk user ID for doctor login
  specialty   String
  qualifications String[]
  experience  Int      // years
  licenseNumber String
  consultationFee Decimal
  bio         String?
  available   Boolean  @default(true)
  avatar      String?  // Uploadthing URL
  gallery     String[] // Uploadthing URLs for doctor gallery
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user        User     @relation(fields: [userId], references: [id])
  appointments Appointment[]
  availability DoctorAvailability[]
  workingHours WorkingHours[]
  reviews      Review[]
}

model Appointment {
  id          String           @id @default(cuid())
  patientId   String
  doctorId    String
  date        DateTime
  startTime   String
  endTime     String
  status      AppointmentStatus @default(PENDING)
  reason      String?
  notes       String?
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
  cancelledAt DateTime?
  cancelledBy String?          // User ID who cancelled
  cancellationReason String?
  attended    Boolean          @default(false)
  followUpNeeded Boolean       @default(false)

  // Relations
  patient     User             @relation("PatientAppointments", fields: [patientId], references: [id])
  doctor      User             @relation("DoctorAppointments", fields: [doctorId], references: [id])
  doctorInfo  Doctor           @relation(fields: [doctorId], references: [userId])
  notifications Notification[]
  prescription Prescription?
  attachments  AppointmentAttachment[]
}

model AppointmentAttachment {
  id            String   @id @default(cuid())
  appointmentId String
  fileName      String
  fileUrl       String   // Uploadthing URL
  fileType      String
  uploadedBy    String   // User ID
  createdAt     DateTime @default(now())

  // Relations
  appointment   Appointment @relation(fields: [appointmentId], references: [id])
}

model MedicalRecord {
  id          String   @id @default(cuid())
  patientId   String
  title       String
  description String?
  fileUrl     String   // Uploadthing URL
  fileType    String
  uploadedBy  String   // Doctor ID
  date        DateTime
  createdAt   DateTime @default(now())

  // Relations
  patient     User     @relation(fields: [patientId], references: [id])
}

model Prescription {
  id            String   @id @default(cuid())
  patientId     String
  doctorId      String
  appointmentId String?
  medication    String
  dosage        String
  frequency     String
  duration      String
  instructions  String?
  prescribedAt  DateTime @default(now())
  expiresAt     DateTime
  refills       Int      @default(0)
  filled        Boolean  @default(false)

  // Relations
  patient       User     @relation(fields: [patientId], references: [id])
  doctor        User     @relation(fields: [doctorId], references: [id])
  appointment   Appointment? @relation(fields: [appointmentId], references: [id])
}

model Review {
  id          String   @id @default(cuid())
  patientId   String
  doctorId    String
  appointmentId String?
  rating      Int      // 1-5
  comment     String?
  approved    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  patient     User     @relation(fields: [patientId], references: [id])
  doctor      Doctor   @relation(fields: [doctorId], references: [id])
  appointment Appointment? @relation(fields: [appointmentId], references: [id])
}

// Blog Models
model BlogCategory {
  id          String    @id @default(cuid())
  name        String
  slug        String    @unique
  description String?
  color       String?   @default("#00BFFF")
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  posts       BlogPost[]
}

model BlogPost {
  id             String        @id @default(cuid())
  title          String
  slug           String        @unique
  excerpt        String
  content        String
  featuredImage  String?
  authorId       String?
  categoryId     String
  readTime       Int           @default(5)
  views          Int           @default(0)
  published      Boolean       @default(false)
  featured       Boolean       @default(false)
  metaTitle      String?
  metaDescription String?
  publishedAt    DateTime?
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  // Relations
  author         Doctor?       @relation(fields: [authorId], references: [id])
  category       BlogCategory  @relation(fields: [categoryId], references: [id])
  tags           BlogTag[]
  comments       BlogComment[]

  @@index([published, publishedAt])
  @@index([categoryId])
}

model BlogTag {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  createdAt DateTime  @default(now())

  posts     BlogPost[]
}

model BlogComment {
  id        String    @id @default(cuid())
  postId    String
  authorId  String?
  parentId  String?
  content   String
  approved  Boolean   @default(false)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  // Relations
  post      BlogPost  @relation(fields: [postId], references: [id])
  author    User?     @relation(fields: [authorId], references: [id])
  parent    BlogComment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies   BlogComment[] @relation("CommentReplies")
}

// Media Gallery Models
model MediaGallery {
  id          String    @id @default(cuid())
  title       String
  description String?
  imageUrl    String    // Uploadthing URL
  category    String?   // "facility", "team", "events", etc.
  order       Int       @default(0)
  published   Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model FacilityImage {
  id          String    @id @default(cuid())
  title       String
  description String
  imageUrl    String    // Uploadthing URL
  features    String[]  // Array of features
  order       Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

// ... (rest of the models remain similar, add clerkId where needed)