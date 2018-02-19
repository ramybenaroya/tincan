describe('Parent Child Test', function() {
	let page;
	this.timeout(30000);

	before(async function() {
		page = await browser.newPage();
		await page.goto(`file://${__dirname}/pages/parent.html`);
	});

	after(async function() {
		await page.close();
	});

	it('Get parent data', async function() {
		const frame = await page.frames().find(f => f.name() === 'child');
		await frame.waitForSelector('#get_parent_data');
		const button = await frame.$('#get_parent_data');
		await button.click();
		await page.waitFor(500);
		const logValue = await frame.evaluate(() => document.querySelector('#child_log').value);
		expect(logValue).to.eql('This is data from parent');
	});

	it('Get parent error', async function() {
		const frame = await page.frames().find(f => f.name() === 'child');
		await frame.waitForSelector('#get_parent_error');
		const button = await frame.$('#get_parent_error');
		await button.click();
		await page.waitFor(500);
		const logValue = await frame.evaluate(() => document.querySelector('#child_log').value);
		expect(logValue).to.have.string('Error of parent.getDataOfParent');
	});

	it('Get parent async data', async function() {
		const frame = await page.frames().find(f => f.name() === 'child');
		await frame.waitForSelector('#get_parent_async_data');
		const button = await frame.$('#get_parent_async_data');
		await button.click();
		await page.waitFor(500);
		const logValue = await frame.evaluate(() => document.querySelector('#child_log').value);
		expect(logValue).to.eql('This is async data from parent');
	});

	it('Get parent async error', async function() {
		const frame = await page.frames().find(f => f.name() === 'child');
		await frame.waitForSelector('#get_parent_async_error');
		const button = await frame.$('#get_parent_async_error');
		await button.click();
		await page.waitFor(500);
		const logValue = await frame.evaluate(() => document.querySelector('#child_log').value);
		expect(logValue).to.have.string('Error of parent.getAsyncErrorOfParent');
	});

	it('Get child data', async function() {
		const button = await page.$('#get_child_data');
		await button.click();
		await page.waitFor(500);
		const logValue = await page.evaluate(() => document.querySelector('#parent_log').value);
		expect(logValue).to.eql('This is data from child');
	});

	it('Get child error', async function() {
		const button = await page.$('#get_child_error');
		await button.click();
		await page.waitFor(500);
		const logValue = await page.evaluate(() => document.querySelector('#parent_log').value);
		expect(logValue).to.have.string('Error of child.getDataOfChild');
	});

	it('Get child async data', async function() {
		const button = await page.$('#get_child_async_data');
		await button.click();
		await page.waitFor(500);
		const logValue = await page.evaluate(() => document.querySelector('#parent_log').value);
		expect(logValue).to.eql('This is async data from child');
	});

	it('Get child async error', async function() {
		const button = await page.$('#get_child_async_error');
		await button.click();
		await page.waitFor(500);
		const logValue = await page.evaluate(() => document.querySelector('#parent_log').value);
		expect(logValue).to.have.string('Error of child.getAsyncErrorOfChild');
	});
});
