export const getIconClass = (name) => {
    switch (name.toLowerCase()) {
      case "marketing":
        return "bi bi-graph-up";
      case "legal":
        return "bi bi-briefcase";
      case "technical":
        return "bi bi-tools";
      case "accounting":
        return "bi bi-calculator";
      default:
        return "bi bi-question-circle";
    }
};