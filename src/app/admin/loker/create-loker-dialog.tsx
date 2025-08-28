// ~/components/admin/job-vacancy/create-job-vacancy-dialog.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { toast } from "sonner";
import { AVAILABLE_STREAMS } from '~/app/(with-sidebar)/loker/loker-filter';

const createJobVacancySchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  position: z.string().min(1, "Position is required"),
  eligibility: z.string().min(1, "Eligibility is required"),
  streams: z.array(z.string()).min(1, "At least one stream is required"),
  overview: z.string().min(1, "Overview is required"),
  timeline: z.string().min(1, "Timeline is required"),
  applyLink: z.string().url("Valid URL is required"),
});

type CreateJobVacancyForm = z.infer<typeof createJobVacancySchema>;

interface CreateJobVacancyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateJobVacancyDialog({
  open,
  onOpenChange,
}: CreateJobVacancyDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreateJobVacancyForm>({
    resolver: zodResolver(createJobVacancySchema),
    defaultValues: {
      title: "",
      company: "",
      position: "",
      eligibility: "",
      streams: [],
      overview: "",
      timeline: "",
      applyLink: "",
    },
  });

  const createMutation = api.loker.create.useMutation({
    onSuccess: () => {
      toast.success("Job vacancy created successfully");
      form.reset();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: CreateJobVacancyForm) => {
    setIsSubmitting(true);
    createMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Job Vacancy</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Frontend Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Tech Corp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position/Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Jakarta, Remote" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="eligibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Eligibility</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Who can apply for this position..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="streams"
              render={() => (
                <FormItem>
                  <FormLabel>Available Streams/Tracks</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {AVAILABLE_STREAMS.map((stream) => (
                      <FormField
                        key={stream}
                        control={form.control}
                        name="streams"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(stream)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, stream])
                                    : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== stream
                                      )
                                    );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              {stream}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="overview"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overview</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Job description and requirements..."
                      className="min-h-32"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timeline</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Application deadline, interview process, etc..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="applyLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Application Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://company.com/careers/apply"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Job Vacancy"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}