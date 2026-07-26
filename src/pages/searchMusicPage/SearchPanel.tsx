import SearchIcon from "@mui/icons-material/Search";
import { Stack, Button, TextField, InputAdornment } from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";

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

  const handlePressEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSearch(currentSearchTrack);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(currentSearchTrack);
  };

  // console.log(currentSearchTrack);
  const handleChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentSearchTrack(event.target.value);
  };

  return (
    <SearchPanelStyled>
      <Stack spacing={1} direction="row" sx={{ display: "flex",}}>
        <TextField
          onKeyDown={handlePressEnter}
          value={currentSearchTrack}
          onChange={handleChangeTextField} fullWidth={true}
          onSubmit={handleSubmit}
          sx={{
            maxWidth: "94%",
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
        <Button onClick={handleSearchClick} sx={{
          width: "6%"
        }} >
          <KeyboardDoubleArrowRightIcon fontSize="large"/>
        </Button>
      </Stack>
    </SearchPanelStyled>
  );
};