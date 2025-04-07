
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const handleGetStarted = () => {
    toast({
      title: "Welcome to SpeakEasyAI!",
      description: "Sign up or log in to start improving your public speaking skills.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-indigo-50">
      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-indigo-800 sm:text-7xl">
            SpeakEasyAI
          </h1>
          <p className="mt-6 text-xl leading-8 text-indigo-600 font-medium">
            Master the art of public speaking with AI-powered feedback and personalized coaching
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Get started
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
            >
              Learn more
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature) => (
              <div 
                key={feature.title}
                className="bg-indigo-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 bg-indigo-100 rounded-md flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-indigo-800 mb-2">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-indigo-50">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">
            How SpeakEasyAI Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stepsData.map((step, index) => (
              <div key={step.title} className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-xl font-bold text-indigo-800 mb-2">{step.title}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className="py-16 px-6 bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-indigo-800 mb-12">
            Who Can Benefit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {usersData.map((user) => (
              <div 
                key={user.title}
                className="bg-indigo-50 p-6 rounded-lg text-center"
              >
                <h3 className="text-xl font-bold text-indigo-800 mb-2">{user.title}</h3>
                <p className="text-gray-700">{user.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-indigo-100">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-bold text-indigo-800 mb-6">
            Ready to become a confident speaker?
          </h2>
          <p className="text-xl text-indigo-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have improved their public speaking skills with SpeakEasyAI.
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-900 text-indigo-100 py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SpeakEasyAI</h3>
              <p className="text-indigo-300">
                Master the art of public speaking with AI-powered feedback and coaching.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Features</h4>
              <ul className="space-y-2">
                <li>AI-Powered Feedback</li>
                <li>Practice Tools</li>
                <li>Personalized Coaching</li>
                <li>Progress Tracking</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li>Blog</li>
                <li>Community</li>
                <li>Speech Library</li>
                <li>Tutorials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-indigo-800 text-center">
            <p>&copy; {new Date().getFullYear()} SpeakEasyAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Feature data
const featuresData = [
  {
    title: "AI-Powered Feedback",
    description: "Get real-time analysis of your speech clarity, pace, tone, and filler words.",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21.64 3.64-1.28-1.28a1.08 1.08 0 0 0-1.52 0L2.36 18.36a1.08 1.08 0 0 0 0 1.52l1.28 1.28a1.08 1.08 0 0 0 1.52 0L21.64 5.16a1.08 1.08 0 0 0 0-1.52Z"/><path d="m14.58 14.58-5.16-5.16"/><path d="M7.1 12.5a5.5 5.5 0 0 0 5.4 5.5"/><path d="M15.5 14.96A5.64 5.64 0 0 0 16.99 12"/><path d="M14 7.5a5.5 5.5 0 0 0-2.5-.5"/></svg>
    )
  },
  {
    title: "Practice Tools",
    description: "Record speeches, upload scripts, and practice with virtual audience simulation.",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v20"/><path d="M2 5h20"/><path d="M3 2h18"/><path d="M7 14a5 5 0 0 0 10 0"/><path d="M8 9h.01"/><path d="M16 9h.01"/></svg>
    )
  },
  {
    title: "Personalized Coaching",
    description: "Receive custom suggestions for improvement based on your individual needs.",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>
    )
  },
  {
    title: "Progress Tracking",
    description: "Visualize your improvement over time with detailed analytics and reports.",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
    )
  },
  {
    title: "Speech Library",
    description: "Access a collection of sample speeches for practice and inspiration.",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
    )
  },
  {
    title: "Community Forum",
    description: "Connect with other users, share tips, and provide feedback.",
    icon: (props: any) => (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z"/></svg>
    )
  }
];

// Steps data
const stepsData = [
  {
    title: "Record & Analyze",
    description: "Record your speech or upload a script for AI analysis of your speaking patterns."
  },
  {
    title: "Get Feedback",
    description: "Receive detailed feedback on your pace, clarity, filler words, and overall delivery."
  },
  {
    title: "Practice & Improve",
    description: "Follow personalized recommendations and track your improvement over time."
  }
];

// Target users data
const usersData = [
  {
    title: "Students",
    description: "Prepare for classroom presentations and build confidence in academic settings."
  },
  {
    title: "Professionals",
    description: "Enhance your meeting presentations, pitches, and conference speeches."
  },
  {
    title: "Everyone",
    description: "Improve your general communication skills for everyday conversations and interactions."
  }
];

export default Index;
