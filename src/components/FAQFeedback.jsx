import { useState } from "react";

export default function FAQFeedback() {

    const [hover, setHover] = useState(0);

    const faqs = [
        {
            q: "How do I upload an Excel file?",
            a: "Just log in, click on 'Upload', and select your .xlsx file. Our system will handle it automatically."
        },
        {
            q: "Is there a limit to file size?",
            a: "Yes, currently we support up to 10MB per file for smooth processing and quick visualization."
        },
        {
            q: "Can I download the charts?",
            a: "Yes! Charts can be exported as PNG or PDF using a one-click download button."
        },
        {
            q: "Is it mobile-friendly?",
            a: "Absolutely. The platform is fully responsive and optimized for mobile, tablet, and desktop."
        },
        {
            q: "Can I customize the charts and colors?",
            a: "Yes! Our platform allows you to apply filters, change chart types, and pick color schemes that best fit your brand or data style."
        },
        {
            q: "Is my Excel data stored or shared?",
            a: "No, your privacy is our priority. We process the Excel file temporarily and do not store or share any data unless you explicitly choose to save it."
        }

    ];

    return (
        <section className="py-16 px-6 text-white">
            <h2 className="text-center text-3xl font-bold text-yellow-300 mb-12">❓ FAQs & Feedback</h2>
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* FAQs */}
                <div className="space-y-6">
                    {faqs.map((faq, i) => (
                        <details
                            key={i}
                            className="bg-white/5 px-6 py-4 rounded-xl shadow transition-all duration-300"
                        >
                            <summary className="cursor-pointer text-lg font-semibold text-yellow-300">
                                {faq.q}
                            </summary>
                            <p className="mt-2 text-gray-300 text-sm leading-relaxed">{faq.a}</p>
                        </details>
                    ))}
                </div>

                {/* Feedback Form */}
                <div className="bg-gradient-to-br from-[#1c1c3a] to-[#23234c] p-10 rounded-xl shadow space-y-4">
                    <h3 className="text-xl font-bold text-yellow-300 mb-2">📬 Send Feedback</h3>



                    <form className="space-y-4">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none"
                        />
                        <textarea
                            rows="4"
                            placeholder="Your Message"
                            className="w-full px-4 py-2 rounded bg-white/10 text-white placeholder-gray-400 border border-white/10 focus:outline-none"
                        ></textarea>
                        <button
                            type="submit"
                            className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-6 py-2 rounded transition"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
