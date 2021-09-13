const overlapInSeconds = ({
	start_date = new Date().toISOString(),
	end_date = new Date().toISOString(),
	start_between_date = new Date().toISOString(),
	end_between_date = new Date().toISOString(),
}) => {

	const first_date_compare = new Date(start_date);
	const final_date_compare = new Date(end_date);

	const start_between = new Date(start_between_date);
	const end_between = new Date(end_between_date);

	
	const last_start =
		first_date_compare.getTime() >= start_between.getTime()
			? first_date_compare
			: start_between;
	
	const last_start_miliseconds = last_start.getTime();
	
	const first_end =
		final_date_compare.getTime() <= end_between.getTime()
			? final_date_compare
			: end_between;
	
	const first_end_miliseconds = first_end.getTime();

	const seconds = (first_end_miliseconds - last_start_miliseconds) / 1000;

	return {
		seconds
	};
};
module.exports={overlapInSeconds}