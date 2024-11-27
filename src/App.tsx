import { useState } from 'react';
import {
	Typography,
	Button,
	Input,
	Grid,
	Box,
	IconButton,
	Select,
	Option,
} from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import ProductSelectionModal from './components/ProductSelectionModel';

const AddProducts = () => {
	const [products, setProducts] = useState([
		{ id: 1, product: '', discount: '' },
	]);
	const [productModelVisible, setProductModelVisible] =
		useState<boolean>(false);
	const [showDiscountUI, setShowDiscountUI] = useState(
		Array(products.length).fill(false)
	);

	const handleAddProduct = () => {
		setProducts([
			...products,
			{ id: products.length + 1, product: '', discount: '' },
		]);
		setShowDiscountUI([...showDiscountUI, false]);
	};

	// const handleInputChange = (index: number, field: string, value: string) => {
	// 	const updatedProducts = [...products];
	// 	updatedProducts[index][field] = value;
	// 	setProducts(updatedProducts);
	// };

	return (
		<Box sx={{ padding: 4, maxWidth: 600, margin: 'auto' }}>
			<Typography level="title-lg" sx={{ marginBottom: 2 }}>
				Add Products
			</Typography>
			<Grid
				display="flex"
				flexDirection="row"
				justifyContent="space-around"
				alignItems="center"
				gap={10}
				mb={2}
			>
				<Typography level="title-md">Product</Typography>
				<Typography level="title-md">Discount</Typography>
			</Grid>

			{products.map((item, index) => (
				<Grid key={item.id} sx={{ marginBottom: 1 }}>
					<Grid
						display={'flex'}
						direction={'row'}
						alignItems={'center'}
						justifyContent="space-between"
						gap={1}
					>
						<Button
							sx={{ p: 0.5 }}
							aria-label="Reorder"
							variant="plain"
						>
							<Typography>::</Typography>
						</Button>
						<Typography
							level="body-md"
							textColor={'background.level3'}
						>
							{index + 1}
						</Typography>
						<Input
							placeholder="Select Product"
							value={item.product}
							sx={{
								minWidth: 300,
								'--Input-focusedThickness': '0px',
							}}
							endDecorator={
								<IconButton
									onClick={() => setProductModelVisible(true)}
								>
									<EditIcon />
								</IconButton>
							}
						/>
						<Grid container maxWidth={180}>
							{showDiscountUI[index] ? (
								<Grid
									display="flex"
									gap={1}
									sx={{ width: '100%' }}
								>
									<Input placeholder="Discount" fullWidth />
									<Select sx={{ minWidth: 102 }}>
										<Option value="20">Flat Off</Option>
										<Option value="30">% Off</Option>
									</Select>
								</Grid>
							) : (
								<Button
									variant="solid"
									sx={{ p: 2, maxHeight: 10, minWidth: 180 }}
									onClick={() => {
										const updatedShowDiscountUI = [
											...showDiscountUI,
										];
										updatedShowDiscountUI[index] =
											!updatedShowDiscountUI[index];
										setShowDiscountUI(
											updatedShowDiscountUI
										);
									}}
								>
									Add Discount
								</Button>
							)}
						</Grid>
					</Grid>
				</Grid>
			))}
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'flex-end',
					marginTop: 2,
				}}
			>
				<Button variant="outlined" onClick={handleAddProduct}>
					Add Product
				</Button>
			</Box>
			<ProductSelectionModal
				productModelVisible={productModelVisible}
				setProductModelVisible={setProductModelVisible}
			/>
		</Box>
	);
};

export default AddProducts;
