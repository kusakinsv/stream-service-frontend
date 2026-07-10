import SearchIcon from "@mui/icons-material/Search";
import { Stack, Button, TextField, InputAdornment } from "@mui/material";

import { getColors } from "@/app/theme/colors.ts";
import { useSearchStore } from "@/app/store/useMusicSearchtState.ts";
import { SearchPanelStyled } from "@/pages/searchMusicPage/SearchPanel.styled.ts";

interface SearchPanelProps {
  onSearch: (trackName: string) => void;
}

export const SearchPanel = ({onSearch}: SearchPanelProps) => {
  const { currentSearchTrack, setCurrentSearchTrack} = useSearchStore();

  const handleSearchClick = () => {
    onSearch(currentSearchTrack);
  };

  // console.log(currentSearchTrack);
  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTrack(event.target.value);
  };

  return (
    <SearchPanelStyled>
      <Stack spacing={2} direction="row" sx={{ display: "flex", justifyContent: "space-around" }}>
        <TextField
          value={currentSearchTrack}
          onChange={handleChangeTextField} fullWidth={true}
          sx={{
            maxWidth: "90%",
            margin: "0 auto",
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: getColors().grey.textSecondary }} />
                </InputAdornment>
              ),
            },
          }} />
        <Button onClick={handleSearchClick}>GO</Button>
      </Stack>
    </SearchPanelStyled>
  );
};