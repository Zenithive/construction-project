
import { Select, MenuItem, Pagination } from '@mui/material';
import { Box } from '../styles/box';
import Stack from '@mui/material/Stack';
import { PAGE } from 'client/app/constants/page.constant';
import { SelectChangeEvent } from '@mui/material/Select';


export interface PaginationProps {
    totalPage: number | 0;
    currentPage: number;
    pageSize: number;
    handlePageSizeChange: (event: SelectChangeEvent<number>) => void;
    handlePageChange: (newPage: number) => void;
}

export const PaginationComponent = ({ totalPage, currentPage, pageSize, handlePageSizeChange, handlePageChange }: PaginationProps) => {

    return (
        <Box>
            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: 20,overflow:"hidden"}} >
                <Stack spacing={2}>
                    <Pagination
                        count={totalPage}
                        page={currentPage}
                        onChange={(event, page) => handlePageChange(page)}
                        color="primary"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                borderRadius: '50%',
                            },
                            '& .MuiPaginationItem-page': {
                                background: "1976D2"
                            },
                        }}
                    />
                </Stack>
            </Box>
            <Box style={{ position: 'relative', marginTop: 2 }}>
                <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    variant="standard"
                    sx={{
                        minWidth: 80,
                        position: "absolute",
                        bottom: 10,
                        left: "350%",
                        backgroundColor: "rgb(26,119,210)",
                        color: "white",
                        borderRadius: "5px",
                        border: "none",
                        textAlign: "center"
                    }}

                >
                    {PAGE.LIMIT.map((limit, index) => (
                        <MenuItem key={index} value={limit.toString()}>{limit} </MenuItem>
                    ))}
            
                </Select>
            </Box>
        </Box>
    );
};
