# Quiz.jsx Theme Update Guide

Due to the file's complexity (560 lines), here's a manual guide to update Quiz.jsx with theme variables.

## Changes to Make:

### 1. Category Selection Screen (Lines ~200-210)
Replace:
```jsx
<p className="text-lg text-gray-600">
```
With:
```jsx
<p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
```

### 2. List View Category Cards (Lines ~234-240)
Replace:
```jsx
className="
  w-full flex items-center gap-4 p-4 
  bg-white border border-slate-200 rounded-xl 
  shadow-sm hover:shadow-md hover:-translate-y-[2px]
  transition-all
  text-left
"
```
With:
```jsx
className="
  w-full flex items-center gap-4 p-4 
  border rounded-xl 
  shadow-sm hover:shadow-md hover:-translate-y-[2px]
  transition-all
  text-left
"
style={{
  background: 'var(--card-bg)',
  borderColor: 'var(--border)'
}}
```

And replace text colors:
```jsx
<p className="text-lg font-semibold text-slate-900">
```
With:
```jsx
<p className="text-lg font-semibold" style={{ color: 'var(--text)' }}>
```

```jsx
<p className="text-sm text-slate-600">{description}</p>
```
With:
```jsx
<p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{description}</p>
```

### 3. Grid View Category Cards (Lines ~268-275)
Replace:
```jsx
className="group h-80 flex flex-col bg-white border 
border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl 
hover:-translate-y-2 transition-all duration-300 cursor-pointer w-full"
```
With:
```jsx
className="group h-80 flex flex-col border 
rounded-2xl shadow-lg hover:shadow-2xl 
hover:-translate-y-2 transition-all duration-300 cursor-pointer w-full"
style={{
  background: 'var(--card-bg)',
  borderColor: 'var(--border)'
}}
```

Card title and description (Lines ~285-295):
```jsx
<CardTitle className="text-2xl font-bold text-center text-gray-900 
  group-hover:text-indigo-600 transition-colors"
>
```
With:
```jsx
<CardTitle className="text-2xl font-bold text-center 
  group-hover:text-indigo-600 transition-colors"
  style={{ color: 'var(--text)' }}
>
```

```jsx
<CardDescription className="text-sm text-center text-gray-600 leading-relaxed mt-1">
```
With:
```jsx
<CardDescription className="text-sm text-center leading-relaxed mt-1"
  style={{ color: 'var(--text-secondary)' }}
>
```

### 4. Quiz Header (Lines ~316-327)
Replace back button:
```jsx
<button
  onClick={handleBackClick}
  className="p-2 rounded-full bg-white shadow-sm border hover:shadow-md transition"
>
  <ArrowLeftIcon className="w-5 h-5 text-slate-700" />
</button>
```
With:
```jsx
<button
  onClick={handleBackClick}
  className="p-2 rounded-full shadow-sm border hover:shadow-md transition"
  style={{
    background: 'var(--card-bg)',
    borderColor: 'var(--border)'
  }}
>
  <ArrowLeftIcon className="w-5 h-5" style={{ color: 'var(--text)' }} />
</button>
```

Title:
```jsx
<h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
```
With:
```jsx
<h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text)' }}>
```

Subtitle:
```jsx
<p className="text-sm text-slate-500">{totalQuestions} Questions</p>
```
With:
```jsx
<p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{totalQuestions} Questions</p>
```

### 5. Quit Prompt Modal (Lines ~330-350)
Replace:
```jsx
<div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-6 py-8 md:px-10 md:py-10">
  <h2 className="text-xl font-semibold text-slate-900 mb-3">
    Quit this quiz?
  </h2>
  <p className="text-sm text-slate-600 mb-6">
```
With:
```jsx
<div className="rounded-3xl shadow-xl border px-6 py-8 md:px-10 md:py-10"
  style={{
    background: 'var(--card-bg)',
    borderColor: 'var(--border)'
  }}
>
  <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text)' }}>
    Quit this quiz?
  </h2>
  <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
```

Cancel button:
```jsx
className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border bg-white text-slate-800 border-slate-300 hover:bg-slate-50"
```
With:
```jsx
className="flex-1 rounded-xl px-4 py-3 font-semibold text-sm md:text-base border hover:opacity-90"
style={{
  background: 'var(--card-bg)',
  color: 'var(--text)',
  borderColor: 'var(--border)'
}}
```

### 6. Resume Prompt (Lines ~365-380)
Same pattern as Quit Prompt - add style prop with theme variables.

### 7. Question Card (Lines ~395-410)
```jsx
<div className="bg-white rounded-3xl shadow-xl border border-slate-100 px-6 py-6 md:px-10 md:py-8">
```
With:
```jsx
<div className="rounded-3xl shadow-xl border px-6 py-6 md:px-10 md:py-8"
  style={{
    background: 'var(--card-bg)',
    borderColor: 'var(--border)'
  }}
>
```

Question text:
```jsx
<h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-6 leading-relaxed">
```
With:
```jsx
<h2 className="text-xl md:text-2xl font-semibold mb-6 leading-relaxed" style={{ color: 'var(--text)' }}>
```

### 8. Answer Options (Lines ~425-435)
Replace:
```jsx
className={`w-full text-left rounded-xl border px-4 py-3 md:px-5 md:py-3.5 text-sm md:text-base transition-all shadow-sm
  ${
    isSelected
      ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.01]"
      : "bg-white text-slate-800 border-slate-200 hover:border-indigo-400 hover:shadow-md"
  }`}
```
With:
```jsx
className={`w-full text-left rounded-xl border px-4 py-3 md:px-5 md:py-3.5 text-sm md:text-base transition-all shadow-sm
  ${
    isSelected
      ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-[1.01]"
      : "border hover:border-indigo-400 hover:shadow-md"
  }`}
style={!isSelected ? {
  background: 'var(--card-bg)',
  color: 'var(--text)',
  borderColor: 'var(--border)'
} : {}}
```

### 9. Navigation Buttons (Lines ~450-465)
Previous button when not disabled:
```jsx
"bg-white text-indigo-700 border-indigo-600 hover:bg-indigo-50"
```
With:
```jsx
"text-indigo-700 border-indigo-600 hover:bg-indigo-50"
```
And add:
```jsx
style={!isFirst ? { background: 'var(--card-bg)' } : {}}
```

### 10. Results Section (Lines ~485-560)
Result card:
```jsx
<div className="mb-6 bg-white rounded-2xl shadow border border-slate-100 px-6 py-4">
  <h2 className="text-xl font-semibold text-slate-900 mb-1">
  <p className="text-slate-700">
```
With:
```jsx
<div className="mb-6 rounded-2xl shadow border px-6 py-4"
  style={{
    background: 'var(--card-bg)',
    borderColor: 'var(--border)'
  }}
>
  <h2 className="text-xl font-semibold mb-1" style={{ color: 'var(--text)' }}>
  <p style={{ color: 'var(--text)' }}>
```

Question cards in results:
```jsx
className="bg-white rounded-2xl shadow border border-slate-100 px-6 py-5"
```
With:
```jsx
className="rounded-2xl shadow border px-6 py-5"
style={{
  background: 'var(--card-bg)',
  borderColor: 'var(--border)'
}}
```

Question titles:
```jsx
<h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
```
With:
```jsx
<h3 className="text-base md:text-lg font-semibold mb-4" style={{ color: 'var(--text)' }}>
```

Feedback box:
```jsx
<div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3 text-sm">
  <p className="font-semibold mb-1">Feedback</p>
  <p className="text-slate-800">
```
With:
```jsx
<div className="rounded-xl border px-4 py-3 text-sm"
  style={{
    background: 'var(--surface)',
    borderColor: 'var(--border)'
  }}
>
  <p className="font-semibold mb-1" style={{ color: 'var(--text)' }}>Feedback</p>
  <p style={{ color: 'var(--text)' }}>
```

## Summary
All hardcoded colors (bg-white, text-slate-*, border-slate-*, etc.) should be replaced with CSS variables via inline styles while keeping all layout classes intact.
