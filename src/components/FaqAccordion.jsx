"use client";
import React, { useState } from 'react';

const questions = [
  {
    question: 'კლინიკის სამუშაო საათები?',
    answer: 'კლინიკის სამუშაო საათებია ყოველდღე შაბათ - კვირის გარდა 09:30 -17:30-მდე.',
  },
  {
    question: 'სად მდებარეობს კლინიკა?',
    answer: 'კლინიკის მისამართია ქუთაისი ფოთის ქუჩა 40',
  },
  {
    question: 'შესაძლებელია თუ არა ანალიზების პასუხების მიღება ელ.ფოსტით?',
    answer: 'დიახ, შესაძლებელია. ანალიზების ჩაბარების დროს შეგიძლიათ დატოვოთ თქვენი ელექტრონული ფოსტის მისამართი.',
  },
  {
    question: 'ხართ თუ არა ჩართული საყოველთაო დაზღვევის პროგრამაში?',
    answer: 'კლინიკაში, პაციენტებს აქვთ შესაძლებლობა ჯანდაცვის სახელმწიფო პროგრამის ფარგლებში ჩაიტარონ გეგმიური ოპერაციები და მიიღონ სამედიცინო მომსახურებები, რომლებიც იფარება საყოველთაო ჯანმრთელობის დაცვის სახელმწიფო პროგრამით.',
  },
  {
    question: 'როგორ ხდება ექიმთან ჩაწერა?',
    answer: 'ექიმთან ჩაწერა შესაძლებელია კლინიკის ცხელი ხაზის მეშვეობით - 0431 23 78 78',
  },
  {
    question: 'როგორ ხდება მაგნიტურ - რეზონანსულ ტომოგრაფიაზე ჩაწერა?',
    answer: 'წინასწარი ჩაწერა შესაძლებელია აღნიშნულ ნომერზე - xxxxxxxxx',
  },
];

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(prev => (prev === index ? null : index));
  };

  return (
    <section className="faq-section" id="faq">
      <h2 className="faq-title">ხშირად დასმული კითხვები</h2>
      <div className="accordion-wrapper">
        {questions.map((item, index) => (
          <div key={index} className="accordion-item">
            <button
              className="accordion-toggle"
              onClick={() => toggleAccordion(index)}
            >
              {item.question}
            </button>
            {activeIndex === index && (
              <div className="accordion-content">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}