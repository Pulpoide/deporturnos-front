import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function StyledSelect({
  label,
  value,
  onChange,
  items,
  minWidth = { xs: 160, sm: 200 },
}) {
  return (
    <FormControl
      size="small"
      sx={{
        minWidth,
        background: "rgba(255,255,255,0.9)",
        borderRadius: 3,
        "& .MuiOutlinedInput-root": {
          borderRadius: 3,
          fontFamily: "Fjalla One",
          "& fieldset": {
            borderColor: "rgba(0,0,0,0.3)",
          },
          "&:hover fieldset": {
            borderColor: "#009688",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#009688",
            borderWidth: 2,
          },
        },
        "& .MuiInputLabel-root": {
          fontFamily: "Fjalla One",
        },
      }}
    >
      <InputLabel>{label}</InputLabel>

      <Select
        value={value}
        label={label}
        onChange={onChange}
        MenuProps={{
          disableScrollLock: true,
          disablePortal: true,
          PaperProps: {
            elevation: 4,
            sx: {
              borderRadius: 3,
              mt: 1,
              background: "white",
              "& .MuiMenuItem-root": {
                fontFamily: "Fjalla One",
                py: 1.5,
                px: 2,
                "&:hover": {
                  backgroundColor: "rgba(0,150,136,0.1)",
                },
              },
            },
          },
        }}
        sx={{ overflow: "visible" }}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
