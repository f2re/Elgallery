<?php
/**
 * Elgallery class.
 *
 * @category   Class
 * @package    ElementorElgallery
 * @subpackage WordPress
 * @author     F2re <f2re@ya.ru>
 * @copyright  2022 F2re
 * @license    https://opensource.org/licenses/GPL-3.0 GPL-3.0-only
 * @link       link(https://github.com/f2re/Elgallery,
 *             Build Custom Elementor Widgets)
 * @since      1.0.2
 * php version 7.3.9
 */

namespace ElementorElgallery\Widgets;

use Elementor\Widget_Base;
use Elementor\Controls_Manager;

// Security Note: Blocks direct access to the plugin PHP files.
defined( 'ABSPATH' ) || die();

/**
 * Elgallery widget class.
 *
 * @since 1.0.0
 */
class Elgallery extends Widget_Base {
	/**
	 * Class constructor.
	 *
	 * @param array $data Widget data.
	 * @param array $args Widget arguments.
	 */
	public function __construct( $data = array(), $args = null ) {
		parent::__construct( $data, $args );

		wp_register_style( 'elgallery', plugins_url( '/assets/css/elgallery.css', ELEMENTOR_ELGALLERY ), array(), '1.0.0' );
		wp_register_script( 'elgallery', plugins_url( '/assets/js/elgallery.js', ELEMENTOR_ELGALLERY ), array(  ), '1.0.0', true );
	}

	/**
	 * Retrieve the widget name.
	 *
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'elgallery';
	}

	/**
	 * Retrieve the widget title.
	 *
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Elgallery', 'elementor-elgallery' );
	}

	/**
	 * Retrieve the widget icon.
	 *
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eicon-gallery-grid';
	}

	/**
	 * Retrieve the list of categories the widget belongs to.
	 *
	 * Used to determine where to display the widget in the editor.
	 *
	 * Note that currently Elementor supports only one category.
	 * When multiple categories passed, Elementor uses the first one.
	 *
	 * @since 1.0.0
	 *
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return array( 'general' );
	}
	
	/**
	 * Enqueue styles.
	 */
	public function get_style_depends() {
		return array( 'elgallery' );
	}

	public function get_script_depends() {
		return array( 'elgallery' );
	  }

	/**
	 * Register the widget controls.
	 *
	 * Adds different input fields to allow the user to change and customize the widget settings.
	 *
	 * @since 1.0.0
	 *
	 * @access protected
	 */
	protected function _register_controls() {
		$this->end_controls_section();
	}

	/**
	 * Render the widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 *
	 * @access protected
	 */
	protected function render() {
		global $product;
		if ($product){
			$product_id = $product->get_id();
			$product = new \WC_product($product_id);
			$attachment_ids = $product->get_gallery_image_ids();
			
			add_image_size( 'thumb-orig', 200, 100, true );

			array_unshift($attachment_ids, get_post_thumbnail_id($product_id));
			?>
			<div class="elgallery-widget">
				<div class="elgallery-mainContainer" id="elgallery-<?php echo $product_id?>">
				</div>
				<div class="block-none">
				<?php foreach ($attachment_ids as $_id) {
					$_img = wp_get_attachment_image_url( $_id, 'thumb-orig' );
					$_img_full = wp_get_attachment_image_url( $_id, 'full' );
					echo '<img class="mklbItem" src="' . $_img . '" data-src="' . $_img_full . '" data-gallery="gallery-'.$product_id.'">';
				} ?>
				</div>
				<div class="grid-adopt">
				<?php foreach ($attachment_ids as $_id) {
					$_img = wp_get_attachment_image_url( $_id, 'thumb-orig' );
					$_img_full = wp_get_attachment_image_url( $_id, 'full' );
					echo '<img class="mklbItem" onload="firstLoad()" src="' . $_img . '" data-src="' . $_img_full . '" data-gallery="gallery-'.$product_id.'">';
				} ?>
				</div>
				<div class="grid-last"></div>
			</div>
			<?php
		}
	}

	/**
	 * Render the widget output in the editor.
	 *
	 * Written as a Backbone JavaScript template and used to generate the live preview.
	 *
	 * @since 1.0.0
	 *
	 * @access protected
	 */
	protected function _content_template() {
		?>
		<div ></div>
		<?php
	}
}
