export default function StepIndicator({ currentStep = 1, totalSteps = 4 }) {
  const steps = [
    { label: 'Informasi Bisnis' },
    { label: 'Data Finansial' },
    { label: 'Detail Tambahan' },
    { label: 'Review & Kirim' },
  ]

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        {/* Progress Line Background */}
        <div className="absolute top-5 left-0 w-full h-[2px] bg-outline-variant -z-10"></div>
        {/* Active Progress Line */}
        <div
          className="absolute top-5 left-0 h-[2px] bg-primary -z-10 transition-all duration-500"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>

        {steps.slice(0, totalSteps).map((step, index) => {
          const stepNum = index + 1
          const isComplete = stepNum < currentStep
          const isActive = stepNum === currentStep
          const isPending = stepNum > currentStep

          return (
            <div key={index} className="flex flex-col items-center gap-2 group">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${
                  isComplete
                    ? 'bg-primary text-on-primary shadow-md'
                    : isActive
                    ? 'bg-white border-2 border-primary shadow-md'
                    : 'bg-surface-container-high border-2 border-outline-variant text-outline-variant'
                } ${isActive || isComplete ? 'group-hover:scale-110' : ''}`}
              >
                {isComplete ? (
                  <span className="material-symbols-outlined text-lg">check</span>
                ) : isActive ? (
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                ) : (
                  <span className="font-bold">{stepNum}</span>
                )}
              </div>
              <span
                className={`font-inter text-label-sm ${
                  isActive ? 'text-primary font-bold' : isComplete ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
