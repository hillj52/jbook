interface ActionButtonProps {
  icon: 'fa-arrow-up' | 'fa-arrow-down' | 'fa-times' | 'fa-plus';
  rounded?: boolean;
  smallIcon?: boolean;
  buttonText?: string;
  onClick: () => void; 
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, rounded, smallIcon, buttonText, onClick}) => {
  const classes = ['button', 'is-primary', 'is-small'];

  if (rounded) {
    classes.push('is-rounded');
  }

  const iconClasses = ['icon'];

  if (smallIcon) {
    iconClasses.push('is-small');
  }

  return (
    <button  
      className={classes.join(' ')} 
      onClick={onClick}
    >
      <span className={iconClasses.join(' ')}>
        <i className={'fas ' + icon}></i>
      </span>
      <span>{buttonText}</span>
    </button>
  );
};

export default ActionButton;