"use client";

import { useState, FormEvent, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Upload, X, AlertCircle, Loader2 } from "lucide-react";

import type { Application, FormErrors } from "../../app/types/Application";

interface ApplyInternshipDialogProps {
  onSubmit: (application: Application) => void;
  triggerText?: string;
  companyId?: string;
}

export default function ApplyInternshipDialog({
  onSubmit,
  triggerText = "Apply Internship",
  companyId = "2b8c1f7d-6d5b-4c2b-9a11-61e4c8a9a233",
}: ApplyInternshipDialogProps) {
  const [errors, setErrors] = useState<FormErrors>({});
  const [open, setOpen] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [resumeFileName, setResumeFileName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [submittedData, setSubmittedData] = useState<any>(null);

  // Auto-close success message after 3 seconds
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setOpen(false);
        setIsSubmitted(false);
        setSubmittedData(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  function validate(formData: FormData): FormErrors {
    const newErrors: FormErrors = {};
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const department = formData.get("department") as string;
    const academicYear = formData.get("academic_year") as string;
    const email = formData.get("email") as string;
    const githubLink = formData.get("github_link") as string;
    const linkedinLink = formData.get("linkedin_link") as string;
    const cv = formData.get("cv") as File | null;
    const resume = formData.get("resume") as File | null;

    if (!firstName || firstName.length < 2) newErrors.first_name = "First name must be at least 2 characters";
    if (!lastName || lastName.length < 2) newErrors.last_name = "Last name must be at least 2 characters";
    if (!department) newErrors.department = "Department is required";
    if (!academicYear) newErrors.academic_year = "Academic year is required";
    if (!email || !email.includes("@") || !email.includes(".")) newErrors.email = "Enter a valid email address";
    if (!githubLink || !githubLink.startsWith("http")) newErrors.github_link = "Enter a valid GitHub URL";
    if (!linkedinLink || !linkedinLink.startsWith("http")) newErrors.linkedin_link = "Enter a valid LinkedIn URL";
    
    if (!cv || cv.size === 0) newErrors.cv = "CV file is required";
    else {
      if (cv.type !== "application/pdf") newErrors.cv = "CV must be a PDF file";
      if (cv.size > 2 * 1024 * 1024) newErrors.cv = "CV must be less than 2MB";
    }

    if (!resume || resume.size === 0) newErrors.resume = "Resume file is required";
    else {
      if (resume.type !== "application/pdf") newErrors.resume = "Resume must be a PDF file";
      if (resume.size > 2 * 1024 * 1024) newErrors.resume = "Resume must be less than 2MB";
    }

    return newErrors;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    // Store form reference immediately before any async operations
    const formElement = e.currentTarget;
    
    const localToken = localStorage.getItem('accessToken') || 
                       localStorage.getItem('token') || 
                       localStorage.getItem('authToken');
    
    if (!localToken) {
      setIsError(true);
      setErrorMessage("Authentication required. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setErrorMessage("");
    
    const formData = new FormData(formElement);
    const validationErrors = validate(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    setErrors({});

    const apiFormData = new FormData();
    apiFormData.append("first_name", formData.get("first_name") as string);
    apiFormData.append("last_name", formData.get("last_name") as string);
    apiFormData.append("department", formData.get("department") as string);
    apiFormData.append("academic_year", formData.get("academic_year") as string);
    apiFormData.append("email", formData.get("email") as string);
    apiFormData.append("github_link", formData.get("github_link") as string);
    apiFormData.append("linkedin_link", formData.get("linkedin_link") as string);
    apiFormData.append("company_id", companyId);
    
    const cvFile = formData.get("cv") as File;
    if (cvFile) apiFormData.append("cv", cvFile, cvFile.name);
    
    const resumeFile = formData.get("resume") as File;
    if (resumeFile) apiFormData.append("resume", resumeFile, resumeFile.name);

    try {
      const response = await fetch("http://localhost:5000/api/applications", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${localToken}` },
        body: apiFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');
          throw new Error("Your session has expired. Please login again.");
        }
        throw new Error(data.message || "Application submission failed");
      }

      const application: Application = {
        id: data.application_id || Date.now(),
        student: `${formData.get("first_name")} ${formData.get("last_name")}`,
        firstName: formData.get("first_name") as string,
        lastName: formData.get("last_name") as string,
        company: "Company Name",
        fieldOfStudy: formData.get("department") as string,
        year: formData.get("academic_year") as string,
        github: formData.get("github_link") as string,
        linkedin: formData.get("linkedin_link") as string,
        cv: formData.get("cv") as File,
        resume: formData.get("resume") as File,
        email: formData.get("email") as string,
        status: "Pending",
        submittedAt: new Date().toISOString(),
      };

      // Store submitted data before resetting form
      const studentName = `${formData.get("first_name")} ${formData.get("last_name")}`;
      const applicationId = data.application_id;

      // Reset form using stored reference (check if still exists)
      if (formElement) {
        try {
          formElement.reset();
        } catch (err) {
          console.log("Form already unmounted, skipping reset");
        }
      }
      setCvFileName("");
      setResumeFileName("");

      // Call parent callback
      onSubmit(application);
      
      // Now update state to show success message
      setSubmittedData({
        studentName,
        applicationId
      });
      
      setIsSubmitted(true);
      
    } catch (error) {
      console.error("Application submission error:", error);
      setIsError(true);
      setErrorMessage(error instanceof Error ? error.message : "Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'cv' | 'resume') => {
    const file = e.target.files?.[0];
    if (file) {
      if (fileType === 'cv') setCvFileName(file.name);
      else setResumeFileName(file.name);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsError(false);
      setErrors({});
      setCvFileName("");
      setResumeFileName("");
      setErrorMessage("");
      setSubmittedData(null);
    }, 300);
  };

  const handleDialogOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setTimeout(() => {
        setIsSubmitted(false);
        setIsError(false);
        setErrors({});
        setCvFileName("");
        setResumeFileName("");
        setErrorMessage("");
        setSubmittedData(null);
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent 
        className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 border-0 rounded-xl shadow-2xl"
        aria-describedby="application-dialog-description"
        onInteractOutside={(e) => { if (isSubmitted) e.preventDefault(); }}
      >
        {/* ✅ FIX: Always include DialogTitle - Hidden when showing success/error */}
        <DialogHeader className={isSubmitted || isError ? "sr-only" : "p-6 pb-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-t-xl"}>
          <div className="flex items-center justify-between">
            <DialogTitle className={isSubmitted || isError ? "sr-only" : "text-2xl font-bold text-gray-800"}>
              {isSubmitted ? "Application Submitted" : isError ? "Submission Failed" : "Submit Student Application"}
            </DialogTitle>
            {!isSubmitted && !isError && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="h-8 w-8 rounded-full hover:bg-orange-200"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {!isSubmitted && !isError && (
            <p className="text-gray-600 mt-2">
              Fill in the student's information to submit their internship application.
            </p>
          )}
        </DialogHeader>
        
        <span id="application-dialog-description" className="sr-only">
          Student internship application form. Fill in the student's personal information, 
          academic details, and upload their CV and resume files.
        </span>

        {/* Success Message */}
        {isSubmitted ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            {/* ✅ FIX: Hidden DialogTitle for accessibility in success state */}
            <DialogHeader className="sr-only">
              <DialogTitle>Application Submitted Successfully</DialogTitle>
            </DialogHeader>
            <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h3>
            <p className="text-gray-600 mb-2">Student application has been submitted successfully.</p>
            {submittedData && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 w-full max-w-md">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Student:</span> {submittedData.studentName}
                </p>
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Application ID:</span> {submittedData.applicationId}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-6">This dialog will close in 3 seconds...</p>
            <div className="flex gap-3 mt-6">
              <Button onClick={() => { setOpen(false); setIsSubmitted(false); setSubmittedData(null); }} className="bg-gradient-to-r from-orange-500 to-orange-600">
                Close
              </Button>
              <Button variant="outline" onClick={() => { setIsSubmitted(false); setSubmittedData(null); setCvFileName(""); setResumeFileName(""); }}>
                Submit Another Application
              </Button>
            </div>
          </div>
        ) : isError ? (
          /* Error Message */
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
            {/* ✅ FIX: Hidden DialogTitle for accessibility in error state */}
            <DialogHeader className="sr-only">
              <DialogTitle>Application Submission Failed</DialogTitle>
            </DialogHeader>
            <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Submission Failed</h3>
            <p className="text-gray-600 mb-6 text-center">{errorMessage}</p>
            <div className="flex gap-3">
              <Button onClick={() => setIsError(false)} className="bg-gradient-to-r from-orange-500 to-orange-600">
                Try Again
              </Button>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Form fields - unchanged */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-gray-700 font-medium">Student First Name *</Label>
                <Input id="first_name" name="first_name" placeholder="Eba" className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.first_name ? 'border-red-500' : ''}`} />
                {errors.first_name && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errors.first_name}</div>}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-gray-700 font-medium">Student Last Name *</Label>
                <Input id="last_name" name="last_name" placeholder="Asfaw" className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.last_name ? 'border-red-500' : ''}`} />
                {errors.last_name && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errors.last_name}</div>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Student Email *</Label>
                <Input id="email" name="email" type="email" placeholder="student@university.edu" className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errors.email}</div>}
              </div>

              {/* Department */}
              <div className="space-y-2">
                <Label htmlFor="department" className="text-gray-700 font-medium">Department *</Label>
                <Input id="department" name="department" placeholder="Computer Engineering" className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.department ? 'border-red-500' : ''}`} />
                {errors.department && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errors.department}</div>}
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <Label htmlFor="academic_year" className="text-gray-700 font-medium">Academic Year *</Label>
                <select id="academic_year" name="academic_year" className={`w-full h-10 px-3 border rounded-md focus:border-orange-500 focus:ring-orange-500 ${errors.academic_year ? 'border-red-500' : 'border-gray-300'}`}>
                  <option value="">Select year</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="5th Year">5th Year</option>
                </select>
                {errors.academic_year && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errors.academic_year}</div>}
              </div>

              {/* GitHub Link */}
              <div className="space-y-2">
                <Label htmlFor="github_link" className="text-gray-700 font-medium">Student GitHub Link *</Label>
                <Input id="github_link" name="github_link" placeholder="https://github.com/studentusername" className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.github_link ? 'border-red-500' : ''}`} />
                {errors.github_link && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errors.github_link}</div>}
              </div>

              {/* LinkedIn Link */}
              <div className="space-y-2">
                <Label htmlFor="linkedin_link" className="text-gray-700 font-medium">Student LinkedIn Link *</Label>
                <Input id="linkedin_link" name="linkedin_link" placeholder="https://linkedin.com/in/studentusername" className={`border-gray-300 focus:border-orange-500 focus:ring-orange-500 ${errors.linkedin_link ? 'border-red-500' : ''}`} />
                {errors.linkedin_link && <div className="flex items-center gap-2 text-red-500 text-sm"><AlertCircle className="h-4 w-4" />{errors.linkedin_link}</div>}
              </div>
            </div>

            <input type="hidden" name="company_id" value={companyId} />

            {/* CV Upload */}
            <div className="space-y-2">
              <Label htmlFor="cv-upload" className="text-gray-700 font-medium flex items-center gap-2"><Upload className="h-4 w-4 text-orange-500" />Student CV (PDF) *</Label>
              <div className="relative">
                <Input type="file" name="cv" accept=".pdf" onChange={(e) => handleFileChange(e, 'cv')} className="hidden" id="cv-upload" />
                <label htmlFor="cv-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-colors duration-300 group cursor-pointer ${errors.cv ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50 hover:bg-orange-100'}`}>
                  <Upload className={`w-8 h-8 mb-3 ${errors.cv ? 'text-red-500' : 'text-orange-500 group-hover:text-orange-600'}`} />
                  <p className="text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF only (MAX. 2MB)</p>
                </label>
                {cvFileName && (
                  <div className="mt-3 flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                    <span className="text-sm font-medium text-gray-700 truncate">{cvFileName}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setCvFileName(""); const input = document.getElementById('cv-upload') as HTMLInputElement; if (input) input.value = ''; }} className="h-8 w-8 p-0 hover:bg-orange-200"><X className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              {errors.cv && <div className="flex items-center gap-2 text-red-500 text-sm mt-2"><AlertCircle className="h-4 w-4" />{errors.cv}</div>}
            </div>

            {/* Resume Upload */}
            <div className="space-y-2">
              <Label htmlFor="resume-upload" className="text-gray-700 font-medium flex items-center gap-2"><Upload className="h-4 w-4 text-orange-500" />Student Resume (PDF) *</Label>
              <div className="relative">
                <Input type="file" name="resume" accept=".pdf" onChange={(e) => handleFileChange(e, 'resume')} className="hidden" id="resume-upload" />
                <label htmlFor="resume-upload" className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-colors duration-300 group cursor-pointer ${errors.resume ? 'border-red-300 bg-red-50' : 'border-orange-300 bg-orange-50 hover:bg-orange-100'}`}>
                  <Upload className={`w-8 h-8 mb-3 ${errors.resume ? 'text-red-500' : 'text-orange-500 group-hover:text-orange-600'}`} />
                  <p className="text-sm text-gray-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-gray-500">PDF only (MAX. 2MB)</p>
                </label>
                {resumeFileName && (
                  <div className="mt-3 flex items-center justify-between bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-3 border border-orange-200">
                    <span className="text-sm font-medium text-gray-700 truncate">{resumeFileName}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setResumeFileName(""); const input = document.getElementById('resume-upload') as HTMLInputElement; if (input) input.value = ''; }} className="h-8 w-8 p-0 hover:bg-orange-200"><X className="h-4 w-4" /></Button>
                  </div>
                )}
              </div>
              {errors.resume && <div className="flex items-center gap-2 text-red-500 text-sm mt-2"><AlertCircle className="h-4 w-4" />{errors.resume}</div>}
            </div>

            {/* Submit Button */}
            <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70">
              {isSubmitting ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" />Submitting Application...</> : 'Submit Application'}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}