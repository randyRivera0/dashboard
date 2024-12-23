import { Button, ButtonGroup, Box } from "@mui/material";

interface IndicatorsButtonGroupProps {
  options: string[]; // Array of options (strings)
  onChange: (selectedOption: string) => void; // Function to handle option change
}

const IndicatorsButtonGroup: React.FC<IndicatorsButtonGroupProps> = ({
  options,
  onChange,
}) => {
  return (
    <Box>
      <ButtonGroup
        variant="text"
        aria-label="Basic button group"
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          justifyContent: "center", // Center buttons within the group
        }}
      >
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onChange(option)}
            sx={{
              marginBottom: 1, // Add margin at the bottom for spacing between rows if wrapped
              whiteSpace: "nowrap", // Prevent text from breaking into multiple lines
              textOverflow: "ellipsis", // Handle overflow text
              overflow: "hidden", // Hide any overflow text
              flex: "1 0 120px", // Allows buttons to grow and shrink based on available space
              minWidth: "120px", // Ensures buttons have a minimum width
            }}
          >
            {option}
          </Button>
        ))}
      </ButtonGroup>
    </Box>
  );
};

export default IndicatorsButtonGroup;
