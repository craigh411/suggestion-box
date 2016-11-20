describe('TemplateParser', function(){

	beforeEach(function(){
		var template = '<div></div>';
		new TemplateParser(template);
	});

	it('should run', function(){
      expect(true).toBeTruthy()
	});
});