import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui'

import { CATEGORIES as categories } from "@/data/categories";


export default function Home() {
  const navigate = useNavigate();

  const handleStartQuiz = (category) => {
    navigate("/quiz", { state: { category } });
  };

  return (
    <>
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-extrabold leading-[1.2] pb-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Quiz Categories
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose a category and test your knowledge!
        </p>
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="group h-80 flex flex-col bg-card border hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer w-full"
            style={{ 
              background: 'var(--card-bg)',
              borderColor: 'var(--border)'
            }}
          >
            <CardHeader className="flex-1 flex flex-col items-center justify-between p-6">
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl category-icon shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: 'var(--accent-1)' }}
              >
                <span className="text-4xl">{category.icon}</span>
              </div>

              <div className="flex flex-col items-center">
                <CardTitle className="card-title text-2xl font-bold text-center transition-colors text-card-foreground">
                  {category.title}
                </CardTitle>

                <CardDescription className="text-sm text-center text-muted-foreground leading-relaxed mt-1">
                  {category.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardFooter className="p-6 pt-0 flex justify-center">
              <button
                className="btn px-6 py-2 text-sm font-semibold rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
                onClick={() => handleStartQuiz(category)}
              >
                Start Quiz →
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}