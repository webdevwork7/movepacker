
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 5,
    text: "Excellent service! The team was professional, efficient, and handled all my belongings with care. Highly recommended!",
    date: "2 weeks ago"
  },
  {
    name: "Michael Chen",
    location: "Los Angeles, CA",
    rating: 5,
    text: "Moving across the country was stress-free thanks to MoveEasy. Great communication and competitive pricing.",
    date: "1 month ago"
  },
  {
    name: "Emily Rodriguez",
    location: "Chicago, IL",
    rating: 5,
    text: "Professional movers who arrived on time and completed the job efficiently. Would definitely use again!",
    date: "3 weeks ago"
  },
  {
    name: "David Wilson",
    location: "Houston, TX",
    rating: 5,
    text: "The booking process was simple and the movers were fantastic. Everything arrived safely at my new home.",
    date: "2 months ago"
  }
];

export const TestimonialSection = () => {
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Quote className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their moving experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                  <p className="text-xs text-gray-500 mt-1">{testimonial.date}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
