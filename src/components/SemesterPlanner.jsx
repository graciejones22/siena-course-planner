import { useEffect, useState } from "react";

function SemesterPlanner({ courses, courseStatuses, onStatusChange }) {
  const [semesters, setSemesters] = useState(() => {
    const savedSemesters = localStorage.getItem(
        "courseflowSemesters"
    );

    return savedSemesters
        ? JSON.parse(savedSemesters)
        : [
            {
              id: 1,
              name: "Fall 2026",
              courses: [],
            },
            {
            id: 2,
              name: "Spring 2027",
              courses: [],
            },
        ];
    });

    useEffect(() => {
        localStorage.setItem(
            "courseflowSemesters",
            JSON.stringify(semesters)
        );
    }, [semesters]);

  const [term, setTerm] = useState("Fall");
  const [year, setYear] = useState("2027");

  function addSemester() {
    const semesterName = `${term} ${year}`;

    const alreadyExists = semesters.some(
      (semester) => semester.name === semesterName
    );

    if (alreadyExists) {
      return;
    }

    setSemesters((currentSemesters) => [
      ...currentSemesters,
      {
        id: Date.now(),
        name: semesterName,
        courses: [],
      },
    ]);
  }

  function addCourseToSemester(courseCode, semesterId) {
    if (!courseCode) {
      return;
    }

    setSemesters((currentSemesters) =>
      currentSemesters.map((semester) => {
        if (semester.id !== Number(semesterId)) {
          return semester;
        }

        if (semester.courses.includes(courseCode)) {
          return semester;
        }

        return {
          ...semester,
          courses: [...semester.courses, courseCode],
        };
      })
    );

    onStatusChange(courseCode, "Planned");
  }

  function removeCourseFromSemester(courseCode, semesterId) {
    setSemesters((currentSemesters) =>
      currentSemesters.map((semester) => {
        if (semester.id !== semesterId) {
          return semester;
        }

        return {
          ...semester,
          courses: semester.courses.filter(
            (code) => code !== courseCode
          ),
        };
      })
    );
  }

  function getCourse(courseCode) {
    return courses.find((course) => course.code === courseCode);
  }

  function getSemesterCredits(semester) {
    return semester.courses.reduce((total, courseCode) => {
      const course = getCourse(courseCode);

      if (!course) {
        return total;
      }

      if (typeof course.credits === "number") {
        return total + course.credits;
      }

      return total + course.credits.min;
    }, 0);
  }

  const plannedCourses = courses.filter(
    (course) =>
      courseStatuses[course.code] === "Planned" &&
      !semesters.some((semester) =>
        semester.courses.includes(course.code)
      )
  );

  return (
    <section className="semester-planner">
      <div className="planner-header">
        <div>
          <h2>Semester Planner</h2>
          <p>
            Organize your planned courses by semester.
          </p>
        </div>

        <div className="add-semester">
          <select
            value={term}
            onChange={(event) =>
              setTerm(event.target.value)
            }
          >
            <option value="Fall">Fall</option>
            <option value="Spring">Spring</option>
          </select>

          <input
            type="number"
            value={year}
            min="2026"
            max="2040"
            onChange={(event) =>
              setYear(event.target.value)
            }
          />

          <button onClick={addSemester}>
            + Add Semester
          </button>
        </div>
      </div>

      <div className="semester-grid">
        {semesters.map((semester) => (
          <div className="semester-card" key={semester.id}>
            <div className="semester-header">
              <div>
                <h3>{semester.name}</h3>
                <p>
                  {getSemesterCredits(semester)} credits
                </p>
              </div>
            </div>

            <div className="semester-courses">
              {semester.courses.length === 0 ? (
                <p className="empty-semester">
                  No courses planned yet.
                </p>
              ) : (
                semester.courses.map((courseCode) => {
                  const course = getCourse(courseCode);

                  return (
                    <div
                      className="planned-course"
                      key={courseCode}
                    >
                      <div>
                        <strong>{courseCode}</strong>
                        <span>{course?.name}</span>
                      </div>

                      <button
                        onClick={() =>
                          removeCourseFromSemester(
                            courseCode,
                            semester.id
                          )
                        }
                      >
                        Remove
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            <select
              value=""
              onChange={(event) =>
                addCourseToSemester(
                  event.target.value,
                  semester.id
                )
              }
            >
              <option value="">
                + Add a course
              </option>

              {plannedCourses.map((course) => (
                <option
                  key={course.code}
                  value={course.code}
                >
                  {course.code} - {course.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SemesterPlanner;