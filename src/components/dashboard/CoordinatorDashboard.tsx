"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  ShieldCheck,
  Users,
  Clock,
  CheckCheck,
  User,
  Calendar,
  Mail,
  UserCheck,
  GraduationCap,
  Sparkles,
  Inbox,
} from "lucide-react"
import StatusActionButtons from "./StatusActionButtons"

export interface Profile {
  id: string
  full_name: string
  role: "student" | "coordinator"
  created_at?: string
}

export interface PendingExperience {
  id: string
  student_id: string
  title: string
  description: string
  strands: string[]
  status: "pending" | "approved" | "completed" | "rejected"
  supervisor_name: string | null
  supervisor_email: string | null
  created_at: string
  profiles: { full_name: string } | { full_name: string }[] | null
}

export interface StudentUser {
  id: string
  full_name: string
  role: string
  created_at?: string
}

interface CoordinatorDashboardProps {
  profile: Profile
  allPendingExperiences: PendingExperience[]
  allStudents: StudentUser[]
}

function getStrandBadge(strand: string) {
  switch (strand.toLowerCase()) {
    case "creativity":
      return (
        <span
          key={strand}
          className="rounded-md border border-amber-500/30 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
        >
          Creativity
        </span>
      )
    case "activity":
      return (
        <span
          key={strand}
          className="rounded-md border border-emerald-500/30 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          Activity
        </span>
      )
    case "service":
      return (
        <span
          key={strand}
          className="rounded-md border border-blue-500/30 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
        >
          Service
        </span>
      )
    default:
      return (
        <Badge key={strand} variant="outline" className="text-[11px]">
          {strand}
        </Badge>
      )
  }
}

export default function CoordinatorDashboard({
  profile,
  allPendingExperiences,
  allStudents,
}: CoordinatorDashboardProps) {
  return (
    <div className="space-y-8">
      {/* Coordinator Welcome Banner */}
      <Card className="border-purple-200 dark:border-purple-900/40 bg-gradient-to-r from-purple-500/10 via-purple-500/5 to-transparent">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl font-bold">
                  Coordinator Control Center
                </CardTitle>
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-300/40">
                  <ShieldCheck className="h-3 w-3" />
                  CAS Coordinator
                </span>
              </div>
              <CardDescription className="text-sm">
                Oversee candidate CAS portfolios, monitor strand requirements, and manage proposal approvals.
              </CardDescription>
            </div>

            <div className="text-sm font-medium text-muted-foreground">
              Coordinator: <strong className="text-foreground">{profile.full_name}</strong>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full sm:w-auto sm:inline-grid grid-cols-3 h-10">
          <TabsTrigger value="overview" className="text-xs sm:text-sm font-medium">
            Overview
          </TabsTrigger>
          <TabsTrigger value="queue" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <span>Approval Queue</span>
            {allPendingExperiences.length > 0 && (
              <span className="rounded-full bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.2">
                {allPendingExperiences.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="roster" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
            <span>Student Roster</span>
            <span className="rounded-full bg-muted text-foreground text-[10px] font-semibold px-1.5 py-0.2">
              {allStudents.length}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Registered Students
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <Users className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allStudents.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Candidate IB Diploma students
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{allPendingExperiences.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Proposals awaiting review
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action callout banner */}
          {allPendingExperiences.length > 0 ? (
            <Card className="border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <CardTitle className="text-base font-bold text-amber-900 dark:text-amber-200">
                    Action Required: {allPendingExperiences.length} Pending Proposal{allPendingExperiences.length > 1 ? "s" : ""}
                  </CardTitle>
                </div>
                <CardDescription className="text-amber-800/80 dark:text-amber-300/80 text-xs">
                  Students are waiting for your approval to proceed with their proposed CAS activities. Open the <strong>Approval Queue</strong> tab to review and issue decisions.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            <Card className="border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCheck className="h-5 w-5 text-emerald-600" />
                  <CardTitle className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Queue is Clear
                  </CardTitle>
                </div>
                <CardDescription className="text-emerald-800/80 dark:text-emerald-300/80 text-xs">
                  All candidate CAS submissions have been reviewed. No immediate action required.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {/* IB CAS Program Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Coordinator Program Guidelines</CardTitle>
              <CardDescription>
                Ensure candidate experiences align with IB CAS criteria: purposeful activities with significant outcomes, personal challenge, and thoughtful reflection.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-lg border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/10 p-4">
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 text-sm">Creativity Focus</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Ensure arts and design experiences demonstrate individual initiative and personal creative growth.
                </p>
              </div>
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/10 p-4">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-200 text-sm">Activity Focus</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Check that physical activities contribute to a healthy routine with defined personal challenges.
                </p>
              </div>
              <div className="rounded-lg border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/10 p-4">
                <h3 className="font-semibold text-blue-900 dark:text-blue-200 text-sm">Service Focus</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Verify authentic community needs, voluntary engagement, and designated adult supervision.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Approval Queue */}
        <TabsContent value="queue" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight">CAS Approval Queue</h3>
              <p className="text-xs text-muted-foreground">
                Review proposed experiences and record official coordinator approvals or revisions.
              </p>
            </div>
            <span className="rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs px-2.5 py-0.5 font-semibold">
              {allPendingExperiences.length} Pending
            </span>
          </div>

          {allPendingExperiences.length === 0 ? (
            <Card className="border-dashed border-2 p-12 text-center bg-card/50">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 mb-3">
                <CheckCheck className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-semibold">All Caught Up!</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto mt-1">
                There are currently no candidate CAS experiences waiting in the approval queue.
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {allPendingExperiences.map((exp) => {
                const studentName = Array.isArray(exp.profiles)
                  ? exp.profiles[0]?.full_name
                  : exp.profiles?.full_name || "Student Candidate"

                return (
                  <Card
                    key={exp.id}
                    className="shadow-sm border-border bg-card transition-all hover:shadow-md"
                  >
                    <CardHeader className="pb-3 border-b bg-muted/10">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Proposed by</p>
                            <p className="text-sm font-semibold text-foreground leading-none">
                              {studentName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {new Date(exp.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
                            <Clock className="h-3 w-3" />
                            Pending Review
                          </span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-4 space-y-4">
                      <div>
                        <CardTitle className="text-lg font-bold">{exp.title}</CardTitle>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {exp.strands && exp.strands.length > 0 ? (
                            exp.strands.map((strand) => getStrandBadge(strand))
                          ) : (
                            <span className="text-xs text-muted-foreground italic">
                              No strands selected
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Description &amp; Goals
                        </p>
                        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
                          {exp.description}
                        </p>
                      </div>

                      {/* Supervisor details */}
                      {(exp.supervisor_name || exp.supervisor_email) && (
                        <div className="rounded-lg border bg-muted/30 p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-muted-foreground">
                              Supervisor:{" "}
                              <strong className="text-foreground">
                                {exp.supervisor_name || "N/A"}
                              </strong>
                            </span>
                          </div>
                          {exp.supervisor_email && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              <span>{exp.supervisor_email}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="border-t bg-muted/10 py-3 px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        Action will immediately update the student&apos;s portfolio.
                      </p>
                      <StatusActionButtons
                        experienceId={exp.id}
                        studentName={studentName}
                      />
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Student Roster */}
        <TabsContent value="roster" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold tracking-tight">Student Roster</h3>
              <p className="text-xs text-muted-foreground">
                All registered candidate students in the Washington School CAS portal.
              </p>
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              Total: {allStudents.length} Students
            </span>
          </div>

          <Card className="shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Full Name</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Joined Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground text-sm">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Inbox className="h-6 w-6 text-muted-foreground/60" />
                        <span>No students registered yet.</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  allStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-semibold text-xs">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {student.full_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {student.id}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          <GraduationCap className="h-3 w-3" />
                          IB Student
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground">
                        {student.created_at
                          ? new Date(student.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}