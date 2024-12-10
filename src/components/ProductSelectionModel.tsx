import React, { useRef, useState, KeyboardEvent, useCallback } from 'react';
import {
	Modal,
	Checkbox,
	ModalDialog,
	DialogTitle,
	Input,
	Button,
	Box,
	Stack,
	CircularProgress,
	Typography,
	Sheet,
	Grid,
	Divider,
	AspectRatio,
} from '@mui/joy';
import { getProductsData } from '../api/FetchProductsAPI';
import { Search } from '@mui/icons-material';
import { useQuery } from '../hooks/useQuery';

export interface Product {
	id: string;
	title: string;
	color: string;
	size: string;
	price: number;
	available: number;

	image?: { id: number; product_id: number; src: string };
	variants: Variant[];

	checked: string | boolean;
}
export type Variant = {
	id: string;
	productId: string;
	title: string;
	price: number;
	checked: boolean;
};

interface ProductSelectionModalProps {
	productModelVisible: boolean;
	setProductModelVisible: React.Dispatch<React.SetStateAction<boolean>>;
	selectedIndex: number;
	addToProductMap: (key: number, value: Product) => void;
}

export const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
	productModelVisible,
	setProductModelVisible,
	selectedIndex,
	addToProductMap,
}) => {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState<string>('');

	const {
		data: products,
		setData: setProducts,
		loading,
		hasError,
		error,
		hasMore,
	} = useQuery<Product, { page: number; search: string; limit: number }>({
		apiCall: getProductsData,
		params: { page, search, limit: 10 },
	});

	// Infinite scroll with intersection observer.
	const observer = useRef<IntersectionObserver | null>(null);

	const lastProductElementRef = useCallback(
		(node: HTMLDivElement | null): void => {
			if (loading || !hasMore) return;

			if (observer.current) {
				observer.current.disconnect();
			}

			observer.current = new IntersectionObserver(
				(entries: IntersectionObserverEntry[]) => {
					if (entries[0].isIntersecting && hasMore && !loading) {
						// console.log('Visible');
						setPage(
							(previousPageNumb: number) => previousPageNumb + 1
						);
					}
				}
			);

			if (node) {
				observer.current.observe(node);
			}
		},
		[hasMore, loading]
	);

	const handleProductCheckChange = (
		product: Product,
		productIndex: number,
		checked: boolean
	) => {
		const updatedProducts = [...products];

		// Update all variants of this product
		const updatedVariants = product.variants.map((variant) => ({
			...variant,
			checked,
		}));

		updatedProducts[productIndex] = {
			...product,
			checked: checked,
			variants: updatedVariants,
		};

		setProducts(updatedProducts);
	};

	const handleVariantCheckChange = (
		productIndex: number,
		variantIndex: number,
		checked: boolean
	) => {
		const updatedProducts = [...products];
		const currentProduct = updatedProducts[productIndex];
		const updatedVariants = [...currentProduct.variants];

		// Update specific variant
		updatedVariants[variantIndex] = {
			...updatedVariants[variantIndex],
			checked,
		};

		// Check if all variants are checked or some are checked
		const allVariantsChecked = updatedVariants.every(
			(variant) => variant.checked
		);
		const someVariantsChecked = updatedVariants.some(
			(variant) => variant.checked
		);

		updatedProducts[productIndex] = {
			...currentProduct,
			variants: updatedVariants,
			checked: allVariantsChecked
				? true
				: someVariantsChecked
				? 'indeterminate'
				: false,
		};

		setProducts(updatedProducts);
	};

	const handleAddProduct = () => {
		const checkedProducts = products.filter((item) => item.checked);
		let key = selectedIndex;
		checkedProducts.forEach((item, index) =>
			index === 0
				? addToProductMap(key, item)
				: addToProductMap(++key, item)
		);
		setProductModelVisible(false);
	};

	return (
		<Modal
			open={productModelVisible}
			onClose={() => setProductModelVisible(false)}
		>
			<ModalDialog>
				<DialogTitle>Search Products</DialogTitle>
				<Input
					startDecorator={<Search />}
					placeholder="Press 'Enter ↵' to search product"
					onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
						if (e.key === 'Enter') {
							const target = e.target as HTMLInputElement;
							setPage(1);
							setSearch(target.value);
						}
					}}
				/>
				{
					<Sheet
						sx={{
							maxWidth: 800,
							height: 300,
							overflow: 'auto',
							overflowX: 'hidden',
							px: 2,
						}}
					>
						<Grid container spacing={2}>
							{products.map(
								(product: Product, productIndex: number) => (
									<Grid
										xs={12}
										key={`$productKey-${product.id}-${productIndex}`}
										ref={
											productIndex === products.length - 1
												? lastProductElementRef
												: null
										}
									>
										<Grid
											display="flex"
											direction="row"
											gap={2}
											alignItems="center"
										>
											<Grid>
												<Checkbox
													checked={
														product.checked === true
													}
													indeterminate={
														product.checked ===
														'indeterminate'
													}
													onChange={(e) =>
														handleProductCheckChange(
															product,
															productIndex,
															e.target.checked
														)
													}
												/>
											</Grid>
											{product.image?.src ? (
												<AspectRatio
													ratio="1"
													sx={{ width: 70, p: 1 }}
												>
													<img
														src={product.image.src}
														alt={product.title}
														loading="lazy"
													/>
												</AspectRatio>
											) : (
												<Box
													sx={{
														width: '50px',
														height: '50px',
														backgroundColor:
															'#cbd5e1',
													}}
												>
													<Typography
														p={1}
														fontSize={'small'}
													>
														Image error
													</Typography>
												</Box>
											)}
											<Grid sx={{ mr: 8 }}>
												<Typography level="title-md">
													{product.title}
												</Typography>
											</Grid>
										</Grid>
										<Divider sx={{ mt: 1 }} inset="none" />

										{product.variants.map(
											(
												variant: Variant,
												variantIndex: number
											) => (
												<React.Fragment
													key={`variant-fragment-${variant.id}-${variantIndex}`}
												>
													<Grid
														xs={12}
														key={`variant-container-${variant.id}-${variantIndex}`}
													>
														<VariantRow
															quantity={99}
															{...variant}
															checked={
																variant.checked ||
																false
															}
															onCheckChange={(
																checked
															) =>
																handleVariantCheckChange(
																	productIndex,
																	variantIndex,
																	checked
																)
															}
														/>
													</Grid>
													<Divider inset="none" />
												</React.Fragment>
											)
										)}
									</Grid>
								)
							)}
						</Grid>
					</Sheet>
				}
				{loading && (
					<Grid xs={12} display="flex" justifyContent="center" py={2}>
						<CircularProgress />
					</Grid>
				)}

				{!hasMore && (
					<Grid xs={12} display="flex" justifyContent="center" py={2}>
						<Typography>No more products</Typography>
					</Grid>
				)}

				{hasError && (
					<Grid xs={12} display="flex" justifyContent="center" py={2}>
						<Typography>{error}</Typography>
					</Grid>
				)}
				<Box
					sx={{
						mt: 1,
						display: 'flex',
						gap: 1,
						flexDirection: { xs: 'column', sm: 'row-reverse' },
					}}
				>
					<Button
						variant="solid"
						color="primary"
						onClick={handleAddProduct}
					>
						Add
					</Button>
					<Button
						variant="outlined"
						color="neutral"
						onClick={() => {
							setProductModelVisible(false);
							setSearch('');
						}}
					>
						Cancel
					</Button>
				</Box>
			</ModalDialog>
		</Modal>
	);
};

interface VariantRowProps {
	id: string;
	title: string;
	quantity: number;
	price: number;
	checked: boolean;
	onCheckChange: (checked: boolean) => void;
}
const VariantRow: React.FC<VariantRowProps> = ({
	id,
	title,
	quantity = 0,
	price,
	checked = false,
	onCheckChange,
}) => {
	return (
		<Stack
			flex={1}
			key={`variant-${id}`}
			direction="row"
			justifyContent="space-between"
			columnGap={1}
		>
			<Stack direction="row" gap={2}>
				<Checkbox
					checked={checked}
					onChange={(e) => onCheckChange?.(e.target.checked)}
				/>
				<Typography>{title}</Typography>
			</Stack>
			<Box>
				<Typography>{quantity} available</Typography>
			</Box>
			<Box>
				<Typography>${price}</Typography>
			</Box>
		</Stack>
	);
};
