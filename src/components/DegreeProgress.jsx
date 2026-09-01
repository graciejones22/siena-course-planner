function DegreeProgress({ program, courses }) {
  return (
    <div className="degree-progress">
      <h2>{program.name}</h2>

      {program.requirements.map((section) => (
        <div className="progress-section" key={section.id}>
          <h3>{section.name}</h3>

          <p>
            Required credits:{" "}
            {typeof section.creditsRequired === "number"
              ? section.creditsRequired
              : `${section.creditsRequired.min}-${section.creditsRequired.max}`}
          </p>
        </div>
      ))}
    </div>
  );
}

export default DegreeProgress;