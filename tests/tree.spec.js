describe('Tree', function(){
	beforeEach(module('tree'));
	beforeEach(module('templates'));
	var testString = '02c1721daed84fe1a28b6f23a023c3f1';

	beforeEach(inject(function(_Tree_, _$filter_, _$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
		$filter = _$filter_;
    Tree = _Tree_;
  }));

	describe('Service', function(){
		describe('search', function(){
			it('should return false on empty string', function(){
				expect(Tree.search()).toBe(false);
			});
			it('should return false on wrong regexp', function(){
				expect(Tree.search(testString, 'gr[')).toBe(false);
			});
			it('should perform regexp search', function(){
				expect(Tree.search(testString, '(\\d+)').length).toBe(10);
			});
		});

		describe('getValue', function(){
			it('should return object', function(){
				expect(Tree.getValue({})).toBe('Object');
			});
			it('should return array', function(){
				expect(Tree.getValue([])).toBe('Array [0]');
			});
			it('should return null', function(){
				expect(Tree.getValue(null)).toBe('null');
			});
			it('should return string', function(){
				expect(Tree.getValue(testString)).toBe(testString);
			});
			it('should return number', function(){
				expect(Tree.getValue(123)).toBe('123');
			});
			it('should highlight search results', function(){
				expect(Tree.getValue(123, '(\\d+)')).toBe('<span class="selected">123</span>');
				expect(Tree.getValue(123, '(1|2|3)')).toBe('<span class="selected">1</span><span class="selected">2</span><span class="selected">3</span>');
				expect(Tree.getValue(111, '1')).toBe('<span class="selected">1</span><span class="selected">1</span><span class="selected">1</span>');
			});
		});

		describe('highlight', function(){
			it('should highlight text', function(){
				expect(Tree.highlight('123', ['1'])).toBe('<span class="selected">1</span>23');
				expect(Tree.highlight('1231', ['1'])).toBe('<span class="selected">1</span>23<span class="selected">1</span>');
				expect(Tree.highlight('asda', ['a'])).toBe('<span class="selected">a</span>sd<span class="selected">a</span>');
			});
			it('should return original text if highlights array is empty', function(){
				expect(Tree.highlight('asd')).toBe('asd');
			});
		})
	});

	describe('Directive', function(){
	 	var html = {
	 			tree: '<div tree="data" search="regexp_to_search"></div>',
	 			treeBranch: '<tree-branch data="data" name="name" search="search"></tree-branch>'
	 		},
		 	testData = {
		 		emptyObject: {},
		 		notEmptyObject: {a: 1},
		 		emptyArray: [],
		 		arrayWithoutDupes: [1, 2, 3, 4],
		 		arrayWithDupes: [1, 2, 3, 1, 1]
		 	};

	  function prepareElement(html, data, search, ame){
	  	$rootScope.data = data;
	  	$rootScope.name = name;
	  	$rootScope.search = search;
	  	var element = $compile(html)($rootScope);
			$rootScope.$digest();
			return element;
	  }

		describe('tree', function(){
			it('should include branch directive', function(){
				expect(
					prepareElement(html.tree, testData.notEmptyObject)
					.find('tree-branch')
					.length)
				.toBe(1);
			});
		});

	 // 	it('should work with nested structures', function(){

	 // 	});

	 	// it('should work with duplicates', function(){
	 	// 	$rootScope.data = {
			// 	name: [1, 2, 3, 1, 1]
			// };
			// var element = $compile(treeDirective)($rootScope);
			// $rootScope.$digest();
			// var length = element.find('tree-branch').length;
	 	// 	expect(length).toBe(5);
	 	// })

	  describe('treeBranch', function(){
	  	it('empty object', function(){
	  		var element = prepareElement(html.treeBranch, testData.emptyObject, '',  'testObject');
	  		expect(element.find('ul li').length).toBe(0);
	  	});

	  	// it('not empty object', function(){
	  	// 	var element = prepareElement(html.treeBranch, testData.notEmptyObject, '1', 'testObject');
	  	// 	expect(element.find('ul li').length).toBe(10);
	  	// });
	  });
	});
});

