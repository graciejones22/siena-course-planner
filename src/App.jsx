import { useState } from "react";
import courses from "./data/courses.json";
import CourseCard from "./components/CourseCard";
import "./App.css";
import programs from "./data/programs.json";
import DegreeProgress from "./components/DegreeProgress";

function App() {
  const [selectedDepartment, setSelectedDepartment] =
    useState("All");

  const [courseStatuses, setCourseStatuses] = useState(() => {
    const savedStatuses = localStorage.getItem("courseStatuses");

    return savedStatuses ? JSON.parse(savedStatuses) : {};
  });

  const departments = [
    "All",
    ...new Set(courses.map((course) => course.department)),
  ];

  const filteredCourses =
    selectedDepartment === "All"
      ? courses
      : courses.filter(
          (course) => course.department === selectedDepartment
        );

  function handleStatusChange(courseCode, newStatus) {
    const updatedStatuses = {
      ...courseStatuses,
      [courseCode]: newStatus,
    };
    setCourseStatuses(updatedStatuses);
    localStorage.setItem("courseStatuses", JSON.stringify(updatedStatuses));
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>CourseFlow</h1>
        <p>
          Plan your college courses and track your degree progress.
        </p>
      </header>

      <DegreeProgress 
        program={programs[0]} 
        courses={courses}
        courseStatuses={courseStatuses}
       />

      <div className="catalog-header">
        <h2>Course Catalog</h2>

        <label>
          Department:{" "}
          <select
            value={selectedDepartment}
            onChange={(event) =>
              setSelectedDepartment(event.target.value)
            }
          >
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="course-grid">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.code}
            course={course}
            status={courseStatuses[course.code] || "Not Taken"}
            onStatusChange={handleStatusChange}
            courseStatuses={courseStatuses}
            courses={courses}
          />
        ))}
      </div>
    </div>
  );
}

export default App;