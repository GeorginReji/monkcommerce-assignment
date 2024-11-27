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
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from '@mui/joy';
import EditIcon from '@mui/icons-material/Edit';
import {
	ProductSelectionModal,
	Product,
	Variant,
} from './components/ProductSelectionModel';

export const AddProducts = () => {
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [productModelVisible, setProductModelVisible] =
		useState<boolean>(false);

	const emptyProduct: Product = {
		id: '',
		title: '',
		color: '',
		size: '',
		price: 0,
		available: 0,
		image: undefined,
		variants: [],
		checked: false,
	};

	const [productMap, setProductMap] = useState<Map<number, Product>>(() => {
		const initialMap = new Map<number, Product>();
		initialMap.set(0, emptyProduct);
		return initialMap;
	});

	const addToProductMap = (key: number, product: Product) => {
		setProductMap((prevMap) => {
			const newMap = new Map(prevMap);
			newMap.set(key, product);
			return newMap;
		});
	};

	const [showDiscountUI, setShowDiscountUI] = useState(
		Array(Array.from(productMap).length).fill(false)
	);

	const handleAddProduct = () => {
		setShowDiscountUI([...showDiscountUI, false]);
		const length = Array.from(productMap).length;
		addToProductMap(length, emptyProduct);
	};

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

			{Array.from(productMap.entries()).map(([key, item], index) => (
				<Grid key={key} sx={{ marginBottom: 1 }}>
					<ProductItem
						index={index}
						item={item}
						setProductModelVisible={setProductModelVisible}
						setSelectedIndex={setSelectedIndex}
						showDiscountUI={showDiscountUI}
						setShowDiscountUI={setShowDiscountUI}
					/>
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
				selectedIndex={selectedIndex}
				addToProductMap={addToProductMap}
			/>
		</Box>
	);
};

interface ProductItemProps {
	index: number;
	item: Product;
	setProductModelVisible?: React.Dispatch<React.SetStateAction<boolean>>;
	setSelectedIndex?: React.Dispatch<React.SetStateAction<number>>;
	showDiscountUI: boolean[];
	setShowDiscountUI: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const ProductItem: React.FC<ProductItemProps> = ({
	index,
	item,
	setProductModelVisible,
	setSelectedIndex,
	showDiscountUI,
	setShowDiscountUI,
}) => {
	return (
		<>
			<Grid
				display={'flex'}
				direction={'row'}
				alignItems={'center'}
				justifyContent="space-between"
				gap={1}
			>
				<Button sx={{ p: 0.5 }} aria-label="Reorder" variant="plain">
					<Typography>::</Typography>
				</Button>
				<Typography level="body-md" textColor={'background.level3'}>
					{index + 1}
				</Typography>
				<Input
					placeholder="Select Product"
					value={item.title}
					sx={{
						minWidth: 300,
						'--Input-focusedThickness': '0px',
					}}
					endDecorator={
						setProductModelVisible && setSelectedIndex ? (
							<IconButton
								onClick={() => {
									setProductModelVisible(true);
									setSelectedIndex(index);
								}}
							>
								<EditIcon />
							</IconButton>
						) : null
					}
				/>
				<Grid container maxWidth={180}>
					{showDiscountUI && showDiscountUI[index] ? (
						<Grid display="flex" gap={1} sx={{ width: '100%' }}>
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
								setShowDiscountUI(updatedShowDiscountUI);
							}}
						>
							Add Discount
						</Button>
					)}
				</Grid>
			</Grid>
			{item.variants?.length > 0 && (
				<ProductVariantsAccordion
					variants={item.variants.filter(
						(variant) => variant.checked
					)}
					showDiscountUI={showDiscountUI}
					setShowDiscountUI={setShowDiscountUI}
				/>
			)}
		</>
	);
};

interface ProductVariantsAccordionProps {
	variants: Variant[];
	showDiscountUI: boolean[];
	setShowDiscountUI: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const ProductVariantsAccordion: React.FC<ProductVariantsAccordionProps> = ({
	showDiscountUI,
	setShowDiscountUI,
	variants,
}) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	return (
		<Box ml={6}>
			<Accordion expanded={isExpanded}>
				<AccordionSummary
					sx={{ display: 'block', ml: '355px' }}
					onClick={() => setIsExpanded(!isExpanded)}
				>
					{isExpanded ? (
						<Typography level="body-sm">Hide variants</Typography>
					) : (
						<Typography level="body-sm">Show variants</Typography>
					)}
				</AccordionSummary>
				<AccordionDetails>
					{variants.map((variant, index) => (
						<Grid
							display={'flex'}
							direction={'row'}
							alignItems={'center'}
							justifyContent="space-between"
							mb={0.5}
						>
							<Button
								sx={{ p: 0.5 }}
								aria-label="Reorder"
								variant="plain"
							>
								<Typography>::</Typography>
							</Button>
							<Input
								placeholder="Select Product"
								value={variant.title}
								size="sm"
								sx={{
									minWidth: 300,
									'--Input-focusedThickness': '0px',
								}}
							/>
							<Grid maxWidth={150}>
								{showDiscountUI[index] ? (
									<Grid
										display="flex"
										gap={1}
										sx={{ width: '100%' }}
									>
										<Input
											placeholder="Discount"
											fullWidth
											size="sm"
										/>
										<Select size="sm" sx={{ minWidth: 90 }}>
											<Option value="20">Flat Off</Option>
											<Option value="30">% Off</Option>
										</Select>
									</Grid>
								) : (
									<Button
										variant="solid"
										sx={{
											maxHeight: 6,
											minWidth: 120,
										}}
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
					))}
				</AccordionDetails>
			</Accordion>
		</Box>
	);
};
