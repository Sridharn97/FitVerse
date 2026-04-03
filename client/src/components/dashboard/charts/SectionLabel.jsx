function SectionLabel({ title, description }) {
  return (
    <div className="mb-1">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
    </div>
  );
}

export default SectionLabel;