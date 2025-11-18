import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui'

const categories = [
  { id: 1, title: 'Science', description: 'Test your knowledge of physics, chemistry, and biology', icon: '🔬' },
  { id: 2, title: 'History', description: 'Explore events that shaped our world', icon: '📜' },
  { id: 3, title: 'Art', description: 'Discover famous artists and masterpieces', icon: '🎨' },
  { id: 4, title: 'Geography', description: 'Journey through countries and capitals', icon: '🌍' },
  { id: 5, title: 'Technology', description: 'Challenge yourself with tech trivia', icon: '💻' },
  { id: 6, title: 'Sports', description: 'Score big with sports knowledge', icon: '⚽' },
]

export default function Home() {
  return (
    <>
      {/* Title */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-extrabold leading-[1.2] pb-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Quiz Categories
        </h1>
        <p className="text-lg text-gray-600">
          Choose a category and test your knowledge!
        </p>
      </div>

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="group h-80 flex flex-col bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer w-full"
          >
            <CardHeader className="flex-1 flex flex-col items-center justify-between p-6">
              <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <span className="text-4xl">{category.icon}</span>
              </div>

              <div className="flex flex-col items-center">
                <CardTitle className="text-2xl font-bold text-center text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {category.title}
                </CardTitle>

                <CardDescription className="text-sm text-center text-gray-600 leading-relaxed mt-1">
                  {category.description}
                </CardDescription>
              </div>
            </CardHeader>

            <CardFooter className="p-6 pt-0 flex justify-center">
              <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200">
                Start Quiz →
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}