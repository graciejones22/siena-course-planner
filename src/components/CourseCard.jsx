function CourseCard({
  course,
  status,
  onStatusChange,
  courseStatuses,
  courses,
}) {
  function isPrerequisiteCompleted(prerequisite) {
    if (typeof prerequisite === "string") {
      return courseStatuses[prerequisite] === "Completed";
    }

    if (prerequisite.all) {
      return prerequisite.all.every((item) =>
        isPrerequisiteCompleted(item)
      );
    }

    if (prerequisite.any) {
      return prerequisite.any.some((item) =>
        isPrerequisiteCompleted(item)
      );
    }

    return true;
  }

  function getPrerequisiteName(courseCode) {
    const prerequisiteCourse = courses.find(
      (item) => item.code === courseCode
    );

    return prerequisiteCourse
      ? `${courseCode} - ${prerequisiteCourse.name}`
      : courseCode;
  }

  function getMissingPrerequisites() {
    if (!course.prerequisites) {
      return [];
    }

    if (Array.isArray(course.prerequisites)) {
      return course.prerequisites.filter(
        (prerequisite) =>
          !isPrerequisiteCompleted(prerequisite)
      );
    }

    if (course.prerequisites.all) {
      return course.prerequisites.all.filter(
        (prerequisite) =>
          !isPrerequisiteCompleted(prerequisite)
      );
    }

    if (course.prerequisites.any) {
      const satisfied = course.prerequisites.any.some(
        (prerequisite) =>
          isPrerequisiteCompleted(prerequisite)
      );

      return satisfied ? [] : course.prerequisites.any;
    }

    return [];
  }

  const missingPrerequisites = getMissingPrerequisites();

  const creditDisplay =
    typeof course.credits === "number"
      ? course.credits
      : `${course.credits.min}-${course.credits.max}`;

  return (
    <div className="course-card">
      <div className="course-code">{course.code}</div>

      <h3>{course.name}</h3>

      <p className="course-info">
        {course.department}
      </p>

      <p className="course-info">
        {creditDisplay} credits
      </p>

      {missingPrerequisites.length > 0 && (
        <div className="prerequisite-warning">
          <strong>⚠ Prerequisite not completed</strong>

          {missingPrerequisites.map((prerequisite) => {
            if (typeof prerequisite === "string") {
              return (
                <p key={prerequisite}>
                  {getPrerequisiteName(prerequisite)}
                </p>
              );
            }

            return (
              <p key={JSON.stringify(prerequisite)}>
                One of the required prerequisite options
                has not been completed.
              </p>
            );
          })}
        </div>
      )}

      <label>
        Status:
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(course.code, event.target.value)
          }
        >
          <option value="Not Taken">Not Taken</option>
          <option value="Planned">Planned</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
    </div>
  );
}

export default CourseCard;