import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"; // Pastikan install shadcn accordion kalau mau keren, atau pake html biasa

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Frequently Asked Questions</h1>
      
      {/* Kalau belum ada Shadcn, pake list biasa aja kayak gini: */}
      <div className="space-y-8">
          
          <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Is Quizu free to use?</h3>
              <p className="text-gray-600 dark:text-zinc-400">Yes! Quizu is completely free for students and developers. We might introduce premium features for advanced interview prep in the future.</p>
          </div>

          <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">What languages are supported?</h3>
              <p className="text-gray-600 dark:text-zinc-400">Currently, we support <strong>Python, JavaScript, TypeScript, and Go</strong>. We are working on adding C++ and Java soon.</p>
          </div>

          <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">How is my code executed?</h3>
              <p className="text-gray-600 dark:text-zinc-400">We use an isolated sandbox environment (Piston) to run your code securely against our test cases. This ensures safety and consistency.</p>
          </div>

          <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Can I contribute a problem?</h3>
              <p className="text-gray-600 dark:text-zinc-400">Absolutely! Check out our Community page or join our Discord server to submit your own coding challenges.</p>
          </div>

      </div>
    </div>
  );
}