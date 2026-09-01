function CourseCard({ course, status, onStatusChange }) {
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